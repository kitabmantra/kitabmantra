'use server'

import { UTApi } from "uploadthing/server";
import { getCurrentUser } from "../../user/get/getCurrentUser";


const utapi = new UTApi();



export const removeMultipleRoomImages = async (imageUrls: string[]) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.userId || !currentUser.email) {
            throw new Error("User not authenticated")
        }

        const keys = imageUrls.map(url => {
            const parts = url.split('/');
            return parts[parts.length - 1];
        });


        const deleteResult = await utapi.deleteFiles(keys);


        if (!deleteResult) {
            throw new Error("Failed to delete images")
        }


        return {
            message: "Images deleted successfully",
            success: true
        }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Something went wrong",
            success: false
        }
    }
}
