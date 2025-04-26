"use server"

import { auth } from "@/auth";
import { getUserModel } from "@/lib/hooks/database/get-user-model";

export const getCurrentUser = async() =>{
    const session = await auth();
    if (!session) return null;
    const userModel = await getUserModel();
    const user = await userModel.findOne({
        userId : session.user.userId
    })
    if (!user) {
        return null;
    }
    return user;

}