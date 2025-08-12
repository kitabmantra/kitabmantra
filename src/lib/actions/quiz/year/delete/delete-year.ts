'use server'

import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser";
import { getBackendUrl } from "@/lib/utils/get-backend-url";
import { getErrorMessage } from "@/lib/utils/get-error";
import axios from "axios";


export interface DeleteYearRequestType {
    id : string;
}

export const deleteYear = async (request : DeleteYearRequestType) => {
    const {id} = request;
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser) throw new Error("Unauthorized");
        if(!currentUser.isAdmin) throw new Error("Unauthorized");
        const url = await getBackendUrl();
        const res = await axios.delete(`${url}/api/v1/year-service/delete-year/${id}`)
        const data = res.data;
        if(!data.success) throw new Error(data.error || "Failed to delete year");
        return {success : true, message : "Year deleted successfully"};
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        return {success : false, error : errorMessage};
    }
}           