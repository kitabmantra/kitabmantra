'use server'

import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser"
import { getBackendUrl } from "@/lib/utils/get-backend-url"
import { getErrorMessage } from "@/lib/utils/get-error"
import axios from "axios"

export const deleteQuestionById = async(id : string) =>{
    try {
        if(!id){
            return {
                error : "Id is required",
                success : false,
            }
        }
        const currentUser = await getCurrentUser()
        if(!currentUser){
            return {
                error : "Unauthorized",
                success : false,
            }
        }
        if(!currentUser.isAdmin){
            return {
                error : "Unauthorized",
                success : false,
            }
        }
        const backendUrl = await getBackendUrl()
        const res = await axios.delete(`${backendUrl}/api/v1/question-service/delete-question/${id}`)
        const data = res.data
        if(!data.success){
            return {
                error : data.error,
                success : false,
            }   
        }
        return data
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        return {
            error : errorMessage,
            success : false,
        }
    }
}