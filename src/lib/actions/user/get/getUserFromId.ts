'use server'

import { getUserModel } from "@/lib/hooks/database/get-user-model";

export const getUserFromId = async(userId : string) =>{
        const userModel = await getUserModel();
        const user = await userModel.findOne({userId : userId});
        if(!user) return null;
        return user;
    
}