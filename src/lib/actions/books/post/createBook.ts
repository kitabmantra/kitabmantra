"use server"

import { getBookModel } from "@/lib/hooks/database/get-book-model";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../../user/get/getCurrentUser";

interface CreateBookResponse {
    success: boolean
    message?: string
}

interface CreateBookProps {
    bookData: CreateBook;
}
export const createBook = async ({
    bookData
}: CreateBookProps): Promise<CreateBookResponse> => {
    const BookModel = await getBookModel();
    const user = await getCurrentUser()

    if (user?.userId) {
        try {
            const createdBook = await BookModel.create({
                userId: user.userId,
                title: bookData.title,
                author: bookData.author,
                description: bookData.description,
                price: bookData.price,
                condition: bookData.condition,
                imageUrl: bookData.imageUrl,
                category: bookData.category,
                type: bookData.type,
                location: bookData.location,
            })
            if (!createdBook) return { success: false, message: "Failed to create book" }

            revalidatePath("/dashboard")
            revalidatePath("/dashboard/my-listings")
            return { success: true }

        } catch (error) {
            console.log("something went wrong: ", error);
            return { success: false }
        }
    } else {
        return { success: false, message: "User not recognized!"}
    }

}

