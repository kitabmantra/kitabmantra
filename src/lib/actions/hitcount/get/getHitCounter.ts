"use server"

import { getMongoClient } from "@/lib/utils/mongoClients"

export const getHitCounter = async () => {
    const {mongooseConn} = await getMongoClient("users")
    const HitCountModel = mongooseConn.models.HitCount

    const hitcount = await HitCountModel.findById("682eb48a7a68e57d4f1a40ae")
    if (!hitcount) return { success: false }

    return { success: true, hitcount }

}