'use server';

import { getBookModel } from "@/lib/hooks/database/get-book-model";
import { getCurrentUser } from "../../user/get/getCurrentUser";
import { getBookRequestModel } from "@/lib/hooks/database/get-book-request-model";
import { getUser } from "../../user/get/getUser";

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

    const bookOwner = await getUser(bookData.userId);
    console.log("this is cheing book onwer", bookOwner)

    if(!bookOwner || !bookOwner.formattedUserData){
      return {
        error : "no such book owner exists",
        success : false,
      }
    }



    const newRequest = await bookRequestModel.create({
      customerId: currentUser.userId,
      customerName : currentUser.name,
      customerEmail : currentUser.name,
      customerPhoneNumber : currentUser.phoneNumber,
      bookOwnerId: bookData.userId,
      bookOwnerName : bookOwner.formattedUserData?.name,
      bookOwnerEmail : bookOwner.formattedUserData?.email,
      bookOwnerPhoneNumber : bookOwner.formattedUserData?.phoneNumber,
      bookStatus: bookData.bookStatus,
      requestStatus: 'pending',
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
