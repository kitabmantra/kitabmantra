import mongoose from "mongoose";

let isConnected = false;

export const connectToDb = async () => {
    mongoose.set('strictQuery', true);

if(!process.env.MONGODB_URL) return console.log("Mongodb url not found")
    if(isConnected) return console.log("already connected Connect");
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true;
        console.log("Connected to Mongo");
    } catch (error) {
        console.log(error);
    }
}
