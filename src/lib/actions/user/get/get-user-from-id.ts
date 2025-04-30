'use server'

import { getUserModel } from "@/lib/hooks/database/get-user-model";

export const getUserFromId = async(userId : string) =>{
    try {
        const userModel = await getUserModel();
        const user = await userModel.findOne({userId : userId});
        if(!user) throw new Error("User not found");
        return user;
    } catch (error) {
        console.log(error)
        return null;
    }
}