'use server'

import { Book } from "@/lib/models/book.model"
import { getMongoClient } from "@/lib/utils/mongoClients"

export async function getBookModel() {
    const {mongooseConn} = await getMongoClient("books")
    if (!mongooseConn.models.Book) {
        mongooseConn.model("Book", Book.schema)
    }
    return mongooseConn.models.Book
}