'use server'

import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser"
import { getBackendUrl } from "@/lib/utils/get-backend-url";
import { getErrorMessage } from "@/lib/utils/get-error"
import axios from "axios";
import { NextResponse } from "next/server"

export async function GET(){
    try {
        const session = await getCurrentUser();
        if(!session){
            throw new Error("Unauthorized")
        }
        const url = await getBackendUrl();
        const res = await axios.get(`${url}/api/v1/category-service/get-academic-category`)
        const data = res.data;
        if(!data.success){
            throw new Error(data.error)
        }
        if(data.success && data.categories === null){
            data.categories = []
        }
        return NextResponse.json(data,{status:200})
    } catch (error) {
        error = getErrorMessage(error)
        return NextResponse.json({
            success:false,
            error
        },{status:500})
        
    }
    
}