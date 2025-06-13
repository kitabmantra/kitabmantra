'use server'

import { getBookRequestModel } from "@/lib/hooks/database/get-book-request-model";
import { getCurrentUser } from "../../user/get/getCurrentUser"
import { revalidatePath } from "next/cache";

export const cancelBookingRequest = async({bookId} : {bookId : string}) =>{
    try {
        if(!bookId){
            return {
                error : "invalid bookid ",
                success : false,
            }
        }
        const currentUser = await getCurrentUser();
        if(!currentUser || !currentUser.userId){
            return {
                error : "no user found",
                success : false,
            }
        }
        const bookRequestModel = await getBookRequestModel();
        const deleteTheRequest = await  bookRequestModel.findOneAndDelete({
            bookId,
            customerId : currentUser.userId,
            requestStatus : "pending"
        });
        console.log('i am canceling')
        if (!deleteTheRequest) {
            return {
                error: "No booking request found to cancel.",
                success: false,
            };
        }
        revalidatePath("/dashboard/activity")
        return {
            message : "successfully cancelled booking request",
            success : true,
        }

    } catch (error) {
        console.log("error in book request cancel ",error)
        return {
            error : "failed to cancel the request",
            success : false,
        }
        
    }
}