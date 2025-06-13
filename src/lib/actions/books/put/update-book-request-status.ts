"use server"
import { getBookRequestModel } from "@/lib/hooks/database/get-book-request-model"
import { getCurrentUser } from "../../user/get/getCurrentUser";
import { revalidatePath } from "next/cache";
import { getBookModel } from "@/lib/hooks/database/get-book-model";
import { getMongoClient } from "@/lib/utils/mongoClients";

interface UpdateRequestStatusParams {
  requestId: string,
  userId: string
  status: 'accepted' | 'rejected'
}

export async function updateBookRequestStatus({ requestId, status, userId }: UpdateRequestStatusParams) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.userId) throw new Error("Unauthorized");
  if (!['accepted', 'rejected'].includes(status)) throw new Error("Invalid status");

  try {
    const { mongooseConn } = await getMongoClient("books");
    const session = await mongooseConn.startSession();

    if (status === "accepted") {
      await session.withTransaction(async () => {
        const db = await getBookRequestModel();
        const bookModel = await getBookModel();

        const requestUpdate = await db.updateOne(
          { bookId: requestId, customerId: userId, requestStatus: "pending" },
          { $set: { requestStatus: status, bookStatus : "reserved" } },
          { session }
        );

        if (!requestUpdate.matchedCount) throw new Error("Request not found");

        await Promise.all([
          db.updateMany(
            { bookId: requestId, customerId: { $ne: userId }, requestStatus: "pending" },
            { $set: { requestStatus: "rejected" } },
            { session }
          ),
          bookModel.findByIdAndUpdate(
            requestId,
            { bookStatus: "reserved" },
            { session }
          )
        ]);
      });
    } else {
      const db = await getBookRequestModel();
      await db.updateOne(
        { bookId: requestId, customerId: userId, requestStatus: "pending" },
        { $set: { requestStatus: status } }
      );
    }

    revalidatePath("/dashboard/activity");
    return { success: true };
    
  } catch (error) {
    console.error("Update failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Update failed" };
  }
}