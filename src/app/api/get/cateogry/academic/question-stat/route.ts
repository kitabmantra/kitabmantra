'use server'

import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser"
import { getBackendUrl } from "@/lib/utils/get-backend-url"
import { getErrorMessage } from "@/lib/utils/get-error"
import axios from "axios"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
try {
    const { searchParams } = new URL(request.url)
    const yearName = searchParams.get('yearName')
    const levelName = searchParams.get('levelName')
    const faculty = searchParams.get('faculty')
    const typeName = searchParams.get('typeName')
    if (!yearName || !levelName || !faculty || !typeName) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const currentUser = await getCurrentUser()
    if (!currentUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if(!currentUser.isAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
const url = await getBackendUrl();
    const res = await axios.get(`${url}/api/v1/question-service/get-question-stat?yearName=${yearName}&levelName=${levelName}&faculty=${faculty}&typeName=${typeName}` )
    const data =res.data;
    if(!data.success){
        throw new Error(data.error)
    }
    return NextResponse.json(data)
} catch (error) {
    error = getErrorMessage(error)
    return NextResponse.json({ error: error }, { status: 500 })
}
}

