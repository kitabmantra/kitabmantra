'use server'

import { getErrorMessage } from "@/lib/utils/get-error"
import { getCurrentUser } from "../../../user/get/getCurrentUser"
import axios from "axios"
import { getBackendUrl } from "@/lib/utils/get-backend-url"

export type CreateAcademicLevel = {
    levelName : string
    type : "academic" | "entrance"
}
export const createAcademicLevel = async (values : CreateAcademicLevel) => {
    try {
        const session = await getCurrentUser();
        if(!session) throw new Error("Unauthorized")
            const url = await getBackendUrl();
        const res = await axios.post(`${url}/api/v1/category-service/create-academic-category`,values)
        const data = res.data;
        if(!data.success) throw new Error(data.error)
        console.log("data after creating academic level",data)
        return data;
    } catch (error) {
        error = getErrorMessage(error)
        console.log("error while creatign academic level",error)
        return {error,success : false}
    }
}