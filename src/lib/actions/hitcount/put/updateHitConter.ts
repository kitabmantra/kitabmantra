"use server"

import { getMongoClient } from "@/lib/utils/mongoClients"
import { revalidatePath } from "next/cache"

export const UpdateHitCounter = async () => {
    const { mongooseConn } = await getMongoClient("users")
    const HitCountModel = mongooseConn.models.HitCount

    await HitCountModel.findByIdAndUpdate({
        _id: "682eb48a7a68e57d4f1a40ae",
    }, {
        $inc: { count: 1 }
    }, { new: true }
    )
    revalidatePath("/")
    return { success: true }
}