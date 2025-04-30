/*eslint-disable*/
"use server"

import { auth } from "@/auth";
import { getUser } from "./getUser";

export const getCurrentUser = async () => {
    const session = await auth();
    if (!session) return null;
    const uData = await getUser(session.user?.id!);
    const user = uData.formattedUserData as User;
    return user;

}