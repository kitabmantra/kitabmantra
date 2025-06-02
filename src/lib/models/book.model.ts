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
        enum : ['New','Like New', 'Good', 'Fair', 'Poor'],
        default: "Good"
    },
    imageUrl: {
        type: [String],
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
        type : String,
        enum : ['Free','Sell', 'Exchange'],
        default : 'Free'
    },
    location: {
        lat : {type : Number},
        lon : {type : Number}
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { collection: 'books' })


bookSchema.index({ title: "text", description: "text", author: "text" });
bookSchema.index({ price: 1 });
bookSchema.index({ "location.lat": 1, "location.lon": 1 });



export const Book = {
    schema: bookSchema,
    model: mongoose.models.Book || mongoose.model("Book", bookSchema)
}

