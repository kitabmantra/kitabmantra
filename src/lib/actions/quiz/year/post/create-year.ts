'use server'

import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser";
import { getBackendUrl } from "@/lib/utils/get-backend-url";
import { getErrorMessage } from "@/lib/utils/get-error";
import axios from "axios";



export interface CreateYearRequestType {
    levelName : string;
    typeName : "academic" | "entrance";
    faculty : string;
    yearName : string;
}

export const createYear = async (request : CreateYearRequestType) => {
    const {levelName, typeName, faculty, yearName} = request;
    try {
        if(!levelName || !typeName || !faculty || !yearName) throw new Error("Invalid request");
        const currentUser = await getCurrentUser();
        if(!currentUser) throw new Error("Unauthorized");
        if(!currentUser.isAdmin) throw new Error("Unauthorized");
        const url = await getBackendUrl();
        const res  = await axios.post(`${url}/api/v1/year-service/create-year`, request)
        const data =res.data;
        if(!data.success) throw new Error(data.error || "Failed to create year");
        return {success : true, message : "Year created successfully"};
    } catch (error) {
     error= getErrorMessage(error)        
     return {success : false, error }
    }
}