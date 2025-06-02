"use server"

import { getBookModel } from "@/lib/hooks/database/get-book-model"

export const getOneBook = async ({ bookId }: { bookId: string }) => {
    const bookModel = await getBookModel();

    const books = await bookModel.findById({ _id: bookId })
    if (!books) return { success: false }
    const formattedBook: PublicBook = {
        userId: books.userId.toString(),
        bookId: books._id.toString(),
        title: books.title,
        author: books.author,
        description: books.description,
        price: books.price,
        condition: books.condition,
        imageUrl: books.imageUrl,
        category: books.category,
        type: books.type,
        location: books.location,
        createdAt: books.createdAt,
    };
    return { success: true, formattedBook : JSON.stringify(formattedBook) };
};