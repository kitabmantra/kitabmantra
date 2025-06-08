import mongoose, { Schema } from "mongoose";
import { bookCondition, bookStatus, bookType } from "../utils/data";

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
        enum: bookCondition,
        default: bookCondition[0],
    },
    imageUrl: {
        type: [String],
    },
    bookStatus : {
        type : String,
        enum : bookStatus,
        default : bookStatus[0],
    },
    category: {
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
    type: {
        type: String,
        enum: bookType,
        default: bookType[0],
    },
    location: {
        address: {
            type: String,
            required: true,
        },
        lat: { type: Number },
        lon: { type: Number }
    },
    advertise: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { collection: 'books' })


bookSchema.index({ title: "text", description: "text", author: "text" });
bookSchema.index({ price: 1 });
bookSchema.index({ "location.lat": 1, "location.lon": 1 });
bookSchema.index({ 
  "category.level": 1,
  "category.faculty": 1,
  "category.year": 1,
  "category.class": 1 
});
bookSchema.index({ type: 1 });
bookSchema.index({ condition: 1 });




export const Book = {
    schema: bookSchema,
    model: mongoose.models.Book || mongoose.model("Book", bookSchema)
}

