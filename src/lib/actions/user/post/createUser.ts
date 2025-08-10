"use server"

import { getUserModel } from "@/lib/hooks/database/get-user-model";
import { getErrorMessage } from "@/lib/utils/get-error";

interface CreateUserProps {
    userName: string;
    name: string;
    email: string;
    image?: string;
    phoneNumber: string;
    userId: string;
}



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

    try {
        // Step 1: Create user in DB
        const newUserResponse = await newUser({ userName, name, email, image, phoneNumber, userId });

        if (!newUserResponse.success) {
            throw new Error(newUserResponse.error || "Failed to create user in DB");
        }

        return {
            success: true,
            message: "User and session created successfully",
        };
    } catch (error) {
        error = getErrorMessage(error)

        return {
            success: false,
            error: getErrorMessage(error) || "Something went wrong",
        };
    }
};
