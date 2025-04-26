"use server"

import { getCurrentUser } from "./getCurrentUser"

export const getUserById = async() =>{
    const currentUser = await getCurrentUser();
    if(!currentUser){
        return null;
    }
    return currentUser;
}