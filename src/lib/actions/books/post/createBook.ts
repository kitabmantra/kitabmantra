"use server";

import { bookSchema } from "@/lib/models/book.model";
import { getMongoClient } from "@/lib/utils/mongoClients";
import { revalidatePath } from "next/cache";

export const createBook = async ({ userId, bookName }: { userId: string, bookName: string }) => {
    const { mongooseConn } = await getMongoClient("books");

    const BookModel = mongooseConn.models.Book || mongooseConn.model("Book", bookSchema);

    const createdBook = await BookModel.create({ userId, bookName });

    if (!createdBook) {
        return { status: 400, message: "Book not created!" };
    }

    revalidatePath("/books");
    return { status: 200, data: createdBook.toObject() };
};

