'use server'

import { UpdateBook } from "@/lib/types/books"
import { getCurrentUser } from "../../user/get/getCurrentUser"
import { getBookModel } from "@/lib/hooks/database/get-book-model"
import { revalidatePath } from "next/cache"

interface UpdateBookType{
    bookData : UpdateBook
}

export const updateBookData = async({bookData} : UpdateBookType) =>{
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser || !currentUser.email || !currentUser.userId){
            return {
                success : false,
                error : "user not authenticated"
            }
        }
        const {title, author, description, price, condition, imageUrl, category, type, location, bookStatus} = bookData;
        const bookModel = await getBookModel();
        const updateBook  = await bookModel.findOneAndUpdate({
            _id : bookData.bookId,
            userId : currentUser.userId
        },{
            title,
            author,
            description,
            price,
            condition,
            imageUrl ,
            category : {
                level : category.level,
                faculty : category.faculty,
                year  : category.year,
                class : category.class,
            },
            type,
            location : {
                address : location.address,
                coordinates : location.coordinates,
            },
            bookStatus
        })

        if(!updateBook){
            return {
                success : false,
                error : "failed to update book data",
            }
        }
        revalidatePath(`/dashboard/my-listings/${bookData.bookId}`)
        revalidatePath(`/dashboard/my-listings`)
        return {
            success : true,
            message : "updated successfully"
        }
    } catch (error) {
        console.error(error)
        return {
            success : false,
            error : "failed to update book"
        }
        
    }
}