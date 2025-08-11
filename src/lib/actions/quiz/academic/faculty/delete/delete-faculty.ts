'use server'

import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser"  
import { getBackendUrl } from "@/lib/utils/get-backend-url"
import { getErrorMessage } from "@/lib/utils/get-error"
import axios from "axios"


export const deleteFaculty = async(facultyId : string) =>{
    try {
        if(!facultyId) throw new Error("Faculty ID is required")
        const currentUser = await getCurrentUser()
        if(!currentUser) throw new Error("Unauthorized")
        const url = await getBackendUrl()
        const res = await axios.delete(`${url}/api/v1/faculty-service/delete-academic-faculty/${facultyId}`)
        const data = res.data;
        if(!data.success){
            throw new Error(data.error)
        }
        return data;
    } catch (error) {
        error = getErrorMessage(error)
        console.log("error in deleteFaculty",error)
        return {error, success : false}
    }
}