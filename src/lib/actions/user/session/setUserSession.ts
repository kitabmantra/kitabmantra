'use server'

import { createSession } from "../post/createUser";
import { cookies } from "next/headers";

export const setUserSession = async(userName: string, email: string, userId: string) => {
    try {
        const sessionResponse = await createSession({ userName, email, userId });

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

        return { success: true };
    } catch (error) {
        console.error("Error setting user session:", error);
        return { success: false, error: "Failed to set user session" };
    }
} 