"use server"

import { getBookModel } from "@/lib/hooks/database/get-book-model"
import { getCurrentUser } from "../../user/get/getCurrentUser";

export const getBooksByUser = async () => {
    const user = await getCurrentUser()
    if (!user) return { success: false }
    const bookModel = await getBookModel();

    const books = await bookModel.find({ userId: user.userId })
    if (!books) return { success: false }
    const formattedBooks: Book[] = books.map((book) => ({
        bookId: book._id.toString(),
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        condition: book.condition,
        imageUrl: book.imageUrl,
        category: book.category,
        type: book.type,
        location: book.location,
        createdAt: book.createdAt,
    }))
    return { success: true, formattedBooks }

}