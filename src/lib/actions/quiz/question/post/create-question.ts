'use server'

import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser"
import { QuestionData } from "@/lib/types/quiz"
import { getBackendUrl } from "@/lib/utils/get-backend-url"
import { getErrorMessage } from "@/lib/utils/get-error"
import axios from "axios"




export interface CreateQuestionRequestType{
    type : "academic" | "entrance"
    levelName : string
    faculty : string
    yearName : string
    questions : QuestionData[]
}


export async function CreateQuesitonForBackend  (data : CreateQuestionRequestType){
    try {
     const currentUser = await getCurrentUser();
     if(!currentUser){
        throw new Error("unauthorized")
     }

     if(!currentUser.isAdmin){
        throw new Error("unauthorized")
     }
     const url = await getBackendUrl()
     const res = await axios.post(`${url}/api/v1/question-service/create-question`,data)
     const value = res.data;
     if(!value.success) throw new Error(value.error|| "failed to create questions")
        return value;
    } catch (error) {
        error = getErrorMessage(error)
        console.log("this is the error  in create question : ",error)
        return {
            error, 
            success  :false,
        }
        
    }
}