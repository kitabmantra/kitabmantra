import mongoose from "mongoose";

const HitSchema = new mongoose.Schema({
  count: { type: Number, default: 1 },
});

export const HitCount = {
    schema: HitSchema,
}