"use server"

import { getBookModel } from "@/lib/hooks/database/get-book-model"
import { PublicBook } from "@/lib/types/books";

export const getAllBooks = async () => {
    const bookModel = await getBookModel();

    const books = await bookModel.find()
    if (!books) return { success: false }
    
    const formattedBooks: PublicBook[] = books.map(book => ({
        userId: book.userId,
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
        bookStatus : book.bookStatus,
        createdAt: book.createdAt.toISOString().slice(0, 10),
    }))
    return { success: true, formattedBooks }

}