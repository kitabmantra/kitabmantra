import mongoose, { Schema } from "mongoose";
import { bookStatus } from "../utils/data";

const bookRequestSchema = new Schema({
    customerId: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
    },
    customerPhoneNumber: {
        type: String, required: true,
    },
    bookOwnerId: {
        type: String,
        required: true,
    },
    bookOwnerName: {
        type: String,
        require: true
    },
    bookOwnerEmail: {
        type: String,
        required: true,
    },
    bookOwnerPhoneNumber: {
        type: String, required: true,
    },

    bookStatus: {
        type: String,
        enum: bookStatus,
        required: true,
    },
    requestStatus: {
        type: String,
        enum: ['rejected', 'pending', 'accepted'],
        required: true,
        default: 'pending'
    },


    bookTitle: {
        type: String,
        required: true,
    },
    bookAuthor: {
        type: String,
        required: true,
    },
    bookDescription: {
        type: String,
        required: true,
    },
    bookPrice: {
        type: Number,
        default: 0,
    },
    bookId: {
        type: String,
        required: true,
    }
}, { timestamps: true })


bookRequestSchema.index({ bookOwnerId: 1, requestStatus: 1 });
bookRequestSchema.index({ customerId: 1, requestStatus: 1 });
bookRequestSchema.index({
    bookTitle: "text",
    bookAuthor: "text",
    bookDescription: "text",
});


export const BookRequest = {
    schema: bookRequestSchema,
    model: mongoose.models.BookRequest || mongoose.model("BookRequest", bookRequestSchema)
}