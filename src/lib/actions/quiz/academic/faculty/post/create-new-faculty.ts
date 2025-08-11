'use server'

import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser"
import { getBackendUrl } from "@/lib/utils/get-backend-url"
import { getErrorMessage } from "@/lib/utils/get-error"
import axios from "axios"


export interface CreateNewFacultyProps{
    levelName : string
    type : "academic" | "entrance"
    faculty : string 
}

export const createNewFaculty = async(props : CreateNewFacultyProps) =>{
    const {levelName , type , faculty} = props

    if(!levelName || !type || !faculty){
        return {error : "All fields are required"}
    }
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) throw new Error("Unauthorized")
            const url = await getBackendUrl();
            const res = await axios.post(`${url}/api/v1/faculty-service/create-academic-faculty`, props)
            const data = res.data;
            if(!data.success){
                throw new Error(data.error)
            }
            return data;
    } catch (error) {
        error = getErrorMessage(error)
        console.log("error in createNewFaculty",error)
        return {error, success : false}
    }
    
}