"use server"
import { getUserModel } from "@/lib/hooks/database/get-user-model";

export const getUser = async (userId: string) => {
    const UserModel = await getUserModel()
    try {
        const userData = await UserModel.findOne({ userId });
        if (!userData) {
            return { message: "404" };
        }
        const formattedUserData: User = {
            userId: userData.userId.toString(),
            name: userData.name,
            email: userData.email,
            image: userData.image,
            phoneNumber : userData.phoneNumber,
            userName: userData.userName,
            isAdmin: userData.isAdmin,
            createdAt: new Date(userData.createdAt).toISOString(),
        };
        return {
            success: true,
            formattedUserData
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        return { message: "something went wrong" };
    }
}
