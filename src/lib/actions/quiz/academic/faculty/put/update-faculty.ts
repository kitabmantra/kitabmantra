'use server'
import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser"
import { getBackendUrl } from "@/lib/utils/get-backend-url"
import { getErrorMessage } from "@/lib/utils/get-error"
import axios from "axios"

export interface UpdateFacultyProps{
    id : string 
    faculty : string
}

export const updateFaculty = async(props : UpdateFacultyProps) =>{
    try {
        const {id , faculty} = props
    if(!id || !faculty) throw new Error("All fields are required")
        const currentUser = await getCurrentUser()
        if(!currentUser) throw new Error("Unauthorized")
        const url = await getBackendUrl()
        const res = await axios.put(`${url}/api/v1/faculty-service/update-academic-faculty/${id}`, {faculty})
        const data = res.data;
        if(!data.success){
            throw new Error(data.error)
        }
        return data;
    } catch (error) {
        error =     getErrorMessage(error)
        console.log("error in updateFaculty",error)
        return {error, success : false}
    }
}