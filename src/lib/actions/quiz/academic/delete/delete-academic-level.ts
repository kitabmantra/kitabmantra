'use server'

import { getErrorMessage } from "@/lib/utils/get-error"
import { getCurrentUser } from "../../../user/get/getCurrentUser"
import axios from "axios"
import { getBackendUrl } from "@/lib/utils/get-backend-url"

export const deleteAcademicLevel = async (id : string) => {
    try {
        if(
            !id
        ) throw new Error("Id is required")
        const session = await getCurrentUser();
        if(!session) throw new Error("Unauthorized")
        const url = await getBackendUrl();
        const res = await axios.delete(`${url}/api/v1/category-service/delete-academic-level-category/${id}`)
        const data = res.data;
        if(!data.success) throw new Error(data.error)
        console.log("data after deleting academic level",data)
        return data;
    } catch (error) {
        error = getErrorMessage(error)
        console.log("error while deleting academic level",error)
        return {error,success : false}
    }
}
