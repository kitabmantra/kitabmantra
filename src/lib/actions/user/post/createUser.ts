"use server"

import { getUserModel } from "@/lib/hooks/database/get-user-model";
interface CreateUserProps{
    userName : string,
    name : string,
    email : string,
    image ?: string,
    phoneNumber : string,
    userId : string,
}

export const createUser = async(data : CreateUserProps) =>{
    try {
        const {userName, name, email, image, phoneNumber, userId} = data;
        if(!userName.trim() || !name.trim() || !email.trim() || !phoneNumber.trim() || !userId.trim()){
            throw new Error("All fields are required")
        }
        const userModel = await getUserModel();
        const newUser = await userModel.create({
            userName : userName.trim(),
            name : name.trim(),
            email : email.trim(),
            image : image?.trim(),
            phoneNumber : phoneNumber.trim(),
            userId : userId.trim(),
        })
        if(!newUser){
            throw new Error("Failed to create user")
        }
        return {
            success : true,
            message : "User created successfully",
        }
    } catch (error) {
        return {
            error : error || "something went wrong",
            success : false,
        }
    }
}