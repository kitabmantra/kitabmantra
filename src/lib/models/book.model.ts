import mongoose, { Schema } from "mongoose";

export const bookSchema = new Schema({
    userId: {
        type: String
    },
    title: {
        type: String,
    },
    author: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0,
    },
    condition: {
        type: String,
        default: "Good"
    },
    imageUrl: {
        type: [String],
    },
    category: {
        type: String,
    },
    type: {
        type: String,
    },
    location: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { collection: 'books' })

export const Book = {
    schema: bookSchema,
    model: mongoose.models.Book || mongoose.model("Book", bookSchema)
}

