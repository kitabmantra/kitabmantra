'use server'

import { Question } from "@/lib/hooks/tanstack-query/query-hook/quiz/academic/year/use-get-academic-questions";
import { getErrorMessage } from "@/lib/utils/get-error";
import axios from "axios";
import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser";
import { getBackendUrl } from "@/lib/utils/get-backend-url";

export async function updateQuestion(question: Question) {
    try {
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
       const res = await axios.put(`${backendUrl}/api/v1/question-service/update-question`, question)
       const data =res.data
       if(!data.success){
        return {
            error : data.error,
            success : false,
        }
       }
       return data
       
    } catch (error) {
       error = getErrorMessage(error)
       return {
        error, success : false,
       }
    }
}