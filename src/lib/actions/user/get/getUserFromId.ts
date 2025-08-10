'use server'

import { getUserModel } from "@/lib/hooks/database/get-user-model";
import { createSession } from "../post/createUser";
import { cookies } from "next/headers";

export const getUserFromId = async(userId : string) =>{
        const userModel = await getUserModel();
        const user = await userModel.findOne({userId : userId});
        if(!user) return null;
        const sessionResponse = await createSession({ userName: user.userName, email: user.email, userId: user.userId });

        if (!sessionResponse.success || !sessionResponse.token) {
            throw new Error(sessionResponse.error || "Failed to create session");
        }

        const cookieStore = await cookies();
        const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        cookieStore.set("user_token", sessionResponse.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            expires: sevenDaysFromNow,
            path: "/",
        });

        return user;
    
}