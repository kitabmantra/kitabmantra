import mongoose, { Schema } from "mongoose";

export const bookSchema = new Schema({
    userId: {
        type: String
    },
    bookName: {
        type: String,
    }
}, { collection: 'books' })

export const Book = {
    schema: bookSchema,
    model: mongoose.models.Book || mongoose.model("Book", bookSchema)
}

