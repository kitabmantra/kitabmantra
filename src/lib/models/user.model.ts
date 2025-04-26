import mongoose, {Schema} from "mongoose"

export const userSchema = new Schema({
    userId : {
        type : String,
        required : true,
        unique : true,
    },
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    userName : {
        type : String,
        required : true,
        unique : true,
    },
    address  :{
        type : String,
    },
    location : {
        type : String,
    },
    image : {
        type : String,
        
    },
    rewardPoint : {
        type : Number,
    },
    isAdmin : {
        type : Boolean,
        default : false,
    }, 
    createdAt: {
        type: Date, 
        default: Date.now,
    }
}, { collection: 'users' })

export const User = {
    schema: userSchema,
    model: mongoose.models.User || mongoose.model("User", userSchema)
}


