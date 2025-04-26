'use server'

import { getMongoClient } from "@/lib/utils/mongoClients"


export async function getUserModel() {
    const {mongooseConn} = await getMongoClient("users")
    return mongooseConn.models.User
}