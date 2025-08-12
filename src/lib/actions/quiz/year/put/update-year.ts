'use server'

import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser";
import { getBackendUrl } from "@/lib/utils/get-backend-url";
import { getErrorMessage } from "@/lib/utils/get-error";
import axios from "axios";

export interface UpdateYearRequestType {
    id: string;
    yearName: string;
}

export const updateYear = async (request: UpdateYearRequestType) => {
    const { id, yearName } = request;
    try {
        if (!id || !yearName) throw new Error("Invalid request");
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error("Unauthorized");
        if (!currentUser.isAdmin) throw new Error("Unauthorized");
        const url = await getBackendUrl();
        const res = await axios.put(`${url}/api/v1/year-service/update-year/${id}`, {yearName})
        const data = res.data;
        if (!data.success) throw new Error(data.error || "Failed to update year");
        return { success: true, message: "Year updated successfully" };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        return { success: false, error: errorMessage };
    }
}