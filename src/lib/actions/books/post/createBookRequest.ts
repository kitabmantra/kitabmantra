'use server';

import { getBookModel } from "@/lib/hooks/database/get-book-model";
import { getCurrentUser } from "../../user/get/getCurrentUser";
import { getBookRequestModel } from "@/lib/hooks/database/get-book-request-model";

  export const createBookRequest = async ({bookId} : {bookId: string}) => {
  console.log("i am called")
  try {
    if (!bookId) {
      return {
        error: "Invalid book ID.",
        success: false,
      };
    }

    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.email || !currentUser.userId) {
      return {
        error: "User not authenticated.",
        success: false,
      };
    }

    const bookModel = await getBookModel();
    const bookData = await bookModel.findById(bookId);

    if (!bookData) {
      return {
        error: "Book not found.",
        success: false,
      };
    }

    if (bookData.userId === currentUser.userId) {
      return {
        error: "You cannot request your own book.",
        success: false,
      };
    }

    const bookRequestModel = await getBookRequestModel();
    console.log("i have got book data : ",bookRequestModel)

    const existingRequest = await bookRequestModel.findOne({
      bookId,
      bookOwnerId: bookData.userId,
      customerId: currentUser.userId,
    });

    if (existingRequest) {
      return {
        error: "You have already requested this book.",
        success: false,
      };
    }

    console.log("this is the found book data : ",bookData)

    const newRequest = await bookRequestModel.create({
      customerId: currentUser.userId,
      bookOwnerId: bookData.userId,
      bookStatus: bookData.bookStatus,
      requestStatus: 'pending',
     
      bookCategory: {
        level: bookData.category?.level || "",
        faculty: bookData.category?.faculty || "",
        year: bookData.category?.year || "",
        class: bookData.category?.class || "",
      },
      bookTitle: bookData.title,
      bookAuthor: bookData.author,
      bookDescription: bookData.description,
      bookPrice: bookData.price || 0,
      bookId: bookData._id, 
    });
    if(!newRequest){
      return {
        error : "failed to create new book request",
        success : false,
      }
    }

    return {
      success: true,
      message: "Book request created successfully.",
    };
  } catch (error) {
    console.error("Error in creating book request:", error);
    return {
      error: error instanceof Error ? error.message :  "Something went wrong. Please try again.",
      success: false,
    };
  }
};
