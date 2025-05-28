'use server'

import { auth } from "@/auth";
import { getUserModel } from "@/lib/hooks/database/get-user-model";

export const getUserFromSession = async()=>{
    try {
        const session = await auth();
        console.log("this is hte sesiosn : ",session);
        const userExist = session?.user?.id || session?.user?.email;
        if(!userExist){
            return null;
        }
        const userModel = await getUserModel();
        const userData = await userModel.findOne({userId : session?.user?.id});
        if(!userData)return null;
         const formattedUserData:User = {
            userId: userData.userId.toString(),
            name: userData.name,
            email: userData.email,
            image: userData.image,
            userName: userData.userName,
            isAdmin: userData.isAdmin,
            createdAt: new Date(userData.createdAt).toISOString(),
        };
        return formattedUserData;
    } catch (error) {
        console.error("Error in gettign user from session : ",error);
        return null;
    }
}