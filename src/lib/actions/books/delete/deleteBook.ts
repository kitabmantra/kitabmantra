'use server'

import { getBookModel } from "@/lib/hooks/database/get-book-model";
import { getCurrentUser } from "../../user/get/getCurrentUser"

export const deleteBook = async (id: string) => {
  try {
    if(!id ||  id.trim() == "") return {
        success : false, error : "invalid id"
    }
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.userId) {
      return { success: false, error: "Unauthorized" };
    }

    const bookModel = await getBookModel();
    const deletedBook = await bookModel.findOneAndDelete({
      _id: id,
      userId: currentUser.userId
    });

    if (!deletedBook) {
      return { success: false, error: "Book not found or unauthorized" };
    }

    return {
      success: true,
      message: "Deleted successfully",
    };

  } catch (error) {
    console.error("Delete book error:", error);
    return { success: false, error: "Internal server error" };
  }
};
