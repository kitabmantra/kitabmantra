/*eslint-disable*/
"use server"
import mongoose, { Connection } from "mongoose";
import { MongoClient } from "mongodb";
import { User } from "@/lib/models/user.model";
import { Book } from "@/lib/models/book.model";
import { HitCount } from "../models/hitcount.model";

const uris = {
    users: process.env.MONGODBUSER!,
    books: process.env.MONGODBOOK!,
};

declare global {
    var _mongoClients: Record<"users" | "books", Promise<MongoClient>>;
    var _mongooseConnections: Record<"users" | "books", Connection>;
}

global._mongoClients ??= {} as any;
global._mongooseConnections ??= {} as any;

export const getMongoClient = async (key: "users" | "books") => {
    const uri = uris[key];
    if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
        throw new Error(`Invalid MongoDB URI for ${key}`);
    }

    if (!global._mongoClients[key]) {
        console.log(`🔌 Connecting ${key} via MongoClient...`);
        const client = new MongoClient(uri);
        global._mongoClients[key] = client.connect();
    }

    if (!global._mongooseConnections[key]) {
        console.log(`🔗 Creating separate Mongoose connection for ${key}...`);
        const conn = await mongoose.createConnection(uri).asPromise();
        if (key === "users") {
            conn.model("User", User.schema);
            conn.model("HitCount", HitCount.schema)
        } else if (key === "books") {
            conn.model("Book", Book.schema);
        }
        global._mongooseConnections[key] = conn;
    }
    const client = await global._mongoClients[key];
    return {
        client,
        mongooseConn: global._mongooseConnections[key],
    };
};
















































// "use server"
// import mongoose, { Connection } from "mongoose";
// import { MongoClient } from "mongodb";

// const uris = {
//     users: process.env.MONGODBUSER!,
//     books: process.env.MONGODBOOK!,
// };

// declare global {
//     var _mongoClients: Record<"users" | "books", Promise<MongoClient>>;
//     var _mongooseConnections: Record<"users" | "books", Connection>;
// }

// global._mongoClients ??= {} as any;
// global._mongooseConnections ??= {} as any;

// export const getMongoClient = async (key: "users" | "books") => {
//     const uri = uris[key];

//     if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
//         throw new Error(`Invalid MongoDB URI for ${key}`);
//     }

//     if (!global._mongoClients[key]) {
//         console.log(`🔌 Connecting ${key} via MongoClient...`);
//         const client = new MongoClient(uri);
//         global._mongoClients[key] = client.connect();
//     }

//     if (!global._mongooseConnections[key]) {
//         console.log(`🔗 Creating separate Mongoose connection for ${key}...`);
//         const conn = await mongoose.createConnection(uri).asPromise();
//         global._mongooseConnections[key] = conn;
//     }

//     return {
//         client: await global._mongoClients[key],
//         mongooseConn: global._mongooseConnections[key],
//     };
// };
