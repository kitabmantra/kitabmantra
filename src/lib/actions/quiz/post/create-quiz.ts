

'use server'

import { QuestionOutput } from "@/components/elements/desktop/application/admin/quiz/CreateQuestionPage";
import { getErrorMessage } from "@/lib/utils/get-error";
import { getCurrentUser } from "../../user/get/getCurrentUser";
import axios from "axios";
import { getBackendUrl } from "@/lib/utils/get-backend-url";

export const createQuiz = async (question : QuestionOutput) => {
    try {
        const user =  await getCurrentUser();
        if(!user){
            throw new Error("Unauthorized")
        }        
        const url = await getBackendUrl()
        const res = await axios.post(`${url}/api/v1/quiz-service/create-question`, question)
        const data =res.data;
        console.log("this is the data : ",data)
        if(!data.success){
            throw new Error(data.error || "Failed to create question")
        }
        return {
            success : true,
            message : "Question created successfully"
        }
    } catch (error) {
        error = getErrorMessage(error)
        console.log("this is hte error : ",error)
        return {
            error, 
            success : false
        }
        
    }
}