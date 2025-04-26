"use server"

import { userSchema } from "@/lib/models/user.model";
import { getMongoClient } from "@/lib/utils/mongoClients";


export const createUser = async ({ userId, name }: { userId: string, name: string }) => {
    const { mongooseConn } = await getMongoClient("users");

    const UserModel = mongooseConn.models.Book || mongooseConn.model("User", userSchema);

    const createdUser = await UserModel.create({ userId, name });

    if (!createdUser) {
        return { status: 400, message: "User not created" }
    }

    return { status: 200 }
}
