import mongoose, { Schema } from "mongoose";
import { bookStatus } from "../utils/data";

const bookRequestSchema = new Schema({
    customerId : {
        type : String,
        required : true,
    },
    bookOwnerId : {
        type : String,
        required : true,
    },
    bookStatus : {
        type : String,
        enum : bookStatus,
        required : true,
    },
    requestStatus : {
        type : String,
        enum : ['rejected', 'pending', 'accepted'],
        required : true,
        default : 'pending'
    },
  
    bookCategory: {
        level: {
            type: String
        },
        faculty: {
            type: String,
        },
        year: {
            type: String,
        },
        class: {
            type: String
        }
    },
    bookTitle: {
        type: String,
        required : true,
    },
    bookAuthor: {
        type: String,
        required : true,
    },
    bookDescription: {
        type: String,
        required : true,
    },
    bookPrice: {
        type: Number,
        default: 0,
    },
    bookId : {
        type : String,
        required : true,
    }
},{timestamps : true})


bookRequestSchema.index({bookStatus : 1,  requestStatus : 1})
bookRequestSchema.index({ bookOwnerId: 1, requestStatus: 1 });


export const BookRequest = {
    schema: bookRequestSchema,
    model: mongoose.models.BookRequest || mongoose.model("BookRequest", bookRequestSchema)
}