'use server'

import { getErrorMessage } from "@/lib/utils/get-error"
import { getCurrentUser } from "../../../user/get/getCurrentUser"
import axios from "axios"
import { getBackendUrl } from "@/lib/utils/get-backend-url"

export type UpdateAcademicLevelType = {
    id : string,
    levelName : string,
    type : "academic" | "entrance",
    oldName : string
}

export const updateAcademicLevel = async (values : UpdateAcademicLevelType) => {
    try {
        const session = await getCurrentUser();
        if(!session) throw new Error("Unauthorized")
            const formData = {
                levelName : values.levelName,
                type : values.type,
                oldName : values.oldName
        }
        const url = await getBackendUrl();
        const res = await axios.put(`${url}/api/v1/category-service/update-academic-level-category/${values.id}`,formData)
        const data = res.data;
        if(!data.success) throw new Error(data.error)
        console.log("data after updating academic level",data)
        return data;
    } catch (error) {
        error = getErrorMessage(error)
        console.log("error while updating academic level",error)
        return {error,success : false}
    }
}