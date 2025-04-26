"use server"

import { getBookModel } from "@/lib/hooks/database/get-book-model"

export const getBooks = async() =>{
    const bookModel = await getBookModel();
    const books = await bookModel.find();
    return books || [];
}