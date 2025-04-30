"use server"

import { getBookModel } from "@/lib/hooks/database/get-book-model";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../../user/get/getCurrentUser";

interface CreateBookProps {
    bookData: CreateBook;
}
export const createBook = async ({
    bookData
}: CreateBookProps) => {
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
            if (!createdBook) return { status: 500, message: "internal server error" }
            revalidatePath("/dashboard")
            revalidatePath("/dahboard/my-listings")
        } catch (error) {
            console.log("something went wrong: ", error);
            return error;
        }
    } else {
        return { message: "User not recognized!" }
    }

}

