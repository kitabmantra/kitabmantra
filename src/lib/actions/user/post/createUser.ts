"use server"

import { getUserModel } from "@/lib/hooks/database/get-user-model";
import { getErrorMessage } from "@/lib/utils/get-error";
import axios from "axios";
import { cookies } from "next/headers";

interface CreateUserProps {
    userName: string;
    name: string;
    email: string;
    image?: string;
    phoneNumber: string;
    userId: string;
}

type CreateSessionProps = {
    userName: string;
    email: string;
    userId: string;
};

export const createSession = async (data: CreateSessionProps) => {
    try {
        if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
            throw new Error("Backend URL not configured");
        }

        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user-service/create-session`,
            data
        );

        const backendData = res.data;

        if (!backendData.success || !backendData.token) {
            throw new Error(backendData.error || "Failed to create session");
        }

        return backendData;
    } catch (error) {
        return {
            error: getErrorMessage(error),
            success: false,
        };
    }
};

const newUser = async (data: CreateUserProps) => {
    try {
        const userModel = await getUserModel();
        const newUser = await userModel.create({
            userName: data.userName.trim(),
            name: data.name.trim(),
            email: data.email.trim(),
            image: data.image?.trim(),
            phoneNumber: data.phoneNumber.trim(),
            userId: data.userId.trim(),
        });

        if (!newUser) {
            throw new Error("Failed to create user");
        }

        return { success: true, message: "User created successfully" };
    } catch (error) {
        return {
            error: getErrorMessage(error),
            success: false,
        };
    }
};

export const createUser = async (data: CreateUserProps) => {
    const { userName, name, email, image, phoneNumber, userId } = data;

    // Validate inputs
    if (!userName.trim() || !name.trim() || !email.trim() || !phoneNumber.trim() || !userId.trim()) {
        return {
            error: "All fields are required",
            success: false,
        };
    }

    let createdUserId: string | null = null;

    try {
        // Step 1: Create user in DB
        const newUserResponse = await newUser({ userName, name, email, image, phoneNumber, userId });

        if (!newUserResponse.success) {
            throw new Error(newUserResponse.error || "Failed to create user in DB");
        }

        createdUserId = userId; // store for rollback if needed

        // Step 2: Create session in backend
        const sessionResponse = await createSession({ userName, email, userId });

        if (!sessionResponse.success || !sessionResponse.token) {
            throw new Error(sessionResponse.error || "Failed to create session");
        }

        console.log("this is the data : ", data)
        const cookieStore = await cookies();
        const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        cookieStore.set("user_token", sessionResponse.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            expires: sevenDaysFromNow,
            path: "/",
        });


        return {
            success: true,
            message: "User and session created successfully",
        };
    } catch (error) {
        // Rollback if user was created but session failed
        if (createdUserId) {
            try {
                const userModel = await getUserModel();
                await userModel.deleteOne({ userId: createdUserId });
            } catch (rollbackError) {
                console.error("Rollback failed:", rollbackError);
            }
        }

        return {
            success: false,
            error: getErrorMessage(error) || "Something went wrong",
        };
    }
};
