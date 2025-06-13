"use server"

import { getBookModel } from "@/lib/hooks/database/get-book-model"
import { PublicBook } from "@/lib/types/books";
import { getUser } from "../../user/get/getUser";

export const getOneBookForId = async ({ bookId }: { bookId: string }) => {
    const bookModel = await getBookModel();

    const books = await bookModel.findById({ _id: bookId })
    if (!books || books.bookStatus != "available") return { success: false }

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
        bookStatus : books.bookStatus,
        location: books.location,
        createdAt: books.createdAt,
    };
    const {formattedUserData} = await getUser(formattedBook.userId);
    
    return { success: true, formattedBook : JSON.stringify({...formattedBook, userName : formattedUserData?.name}) };
};