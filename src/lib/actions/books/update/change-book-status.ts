'use server'

import { getBookModel } from "@/lib/hooks/database/get-book-model";
import { getCurrentUser } from "../../user/get/getCurrentUser"
import { BookStatusType } from "@/lib/types/books";
import { revalidatePath } from "next/cache";

export interface ChangeBookStatusType {
    id : string,
    status : BookStatusType
}

export  const ChangeBookStatus = async ( {id, status} : ChangeBookStatusType) =>{
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser || !currentUser.userId || !currentUser.email){
            return {
                success : false
            }
        }
        const bookModel = await getBookModel();
        const updateBook = await bookModel.findOneAndUpdate({_id : id, userId : currentUser.userId},{
            bookStatus : status
        }, {new : true});
        if(!updateBook){
            return {
                success : false
            }
        }
        revalidatePath(`/dashboard/my-listings/${id}`)
        revalidatePath(`/dashboard/my-listings`)
        return {
            success : true,
            message : "updated successfully"
        }
    } catch (error) {
        console.error("error in updating status : ",error)
        return {
            success : false
        }
        
    }
}