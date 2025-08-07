'use server'

import { getBookRequestModel } from "@/lib/hooks/database/get-book-request-model"
import { getCurrentUser } from "../../user/get/getCurrentUser";


export const getBookRequestStatus = async({bookId, userId} : {bookId : string, userId ?: string}) =>{
    try {
        if(!userId)return {
            error : ""
        };

        if (!bookId && !userId) {
            return {
              error: "Book ID and User ID are required.",
            };
          }
          const currentUser = await getCurrentUser();
          if(!currentUser){
            return {
                error : ""
            }
          }
        const bookRequest = await getBookRequestModel();
        const findBookRequest = await bookRequest.findOne({
            bookId,
            customerId : userId,
            requestStatus : {$ne : "rejected"}

        });
        console.log("book request sttus : ", findBookRequest)
        if(!findBookRequest){
            return {
                status : "not-booked"
            }
        }
        return {
            status : "booked"
        }
    } catch (error) {
        console.error("Error in get book request : ",error)
        return {
            error : "failed to get book statuss"
        }
        
    }
}