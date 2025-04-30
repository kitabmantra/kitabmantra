'use server'

import { getUserModel } from "@/lib/hooks/database/get-user-model";

export const checkUserName = async(userName : string) =>{
    if(!userName){
        return false;
    }

    const userModel = await getUserModel();
    const checkUserName = await userModel.findOne({userName : userName.trim()})

    if(!checkUserName){
        return true;
    }
    return false;
}