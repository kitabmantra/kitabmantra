'use server'

import { BookRequest } from "@/lib/models/book-request.model"
import { getMongoClient } from "@/lib/utils/mongoClients"

export async function getBookRequestModel(){
    const { mongooseConn } = await getMongoClient("books");
    
    if (!mongooseConn.models.BookRequest) {
      mongooseConn.model("BookRequest", BookRequest.schema);
    }
    
    return mongooseConn.models.BookRequest;
  }