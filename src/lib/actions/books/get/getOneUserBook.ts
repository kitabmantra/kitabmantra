'use server'

import { getBookModel } from "@/lib/hooks/database/get-book-model";
import { getCurrentUser } from "../../user/get/getCurrentUser"
import { Book } from "@/lib/types/books";

export const getOneUserBook = async (id: string) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.userId) {
            throw new Error();
        }
        const bookModel = await getBookModel();
        const bookData = await bookModel.findOne({
            _id: id,
            userId: currentUser.userId
        });
        console.log("this is hte bookData ",bookData)
        if(!bookData){
            console.log("i am running man ")
            return {
                success : true,
                formattedbookData : null
            }
        }
        
        const formattedbookData: Book = {
            userId: bookData.userId.toString(),
            bookId: bookData._id.toString(),
            title: bookData.title,
            author: bookData.author,
            description: bookData.description,
            price: bookData.price,
            condition: bookData.condition,
            imageUrl: bookData.imageUrl,
            category: JSON.stringify(bookData.category),
            type: bookData.type,
            bookStatus : bookData.bookStatus,
            location: JSON.stringify(bookData.location),
            createdAt: bookData.createdAt.toISOString(),
        };
        console.log("this is hte formated data in server  : ",formattedbookData)
        return {
            success: true,
            formattedbookData
        }

    } catch (error) {
        console.log("this is hte data : ",error)
        return { success: false, error }

    }
}