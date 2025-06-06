'use server'

import { getBookModel } from "@/lib/hooks/database/get-book-model";
import { getCurrentUser } from "../../user/get/getCurrentUser"
import { removeMultipleImages } from "../../uploadthing/delete-images";

export const deleteBook = async (id: string) => {
  try {
    if (!id || id.trim() === "") {
      return { success: false, error: "Invalid ID" };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser?.userId) {
      return { success: false, error: "Unauthorized" };
    }

    const bookModel = await getBookModel();
    
    const bookToDelete = await bookModel.findOne({
      _id: id,
      userId: currentUser.userId
    });

    if (!bookToDelete) {
      return { success: false, error: "No such book exists" };
    }

    const [deleteResult, ] = await Promise.all([
      bookModel.findByIdAndDelete(bookToDelete._id),
      removeMultipleImages(bookToDelete.imageUrl)
    ]);

    if (!deleteResult) {
      console.error("Database deletion failed for book:", id);
      return { success: false, error: "Failed to delete book from database" };
    }

    return {
      success: true,
      message: "Book and images deleted successfully",
    };

  } catch (error) {
    console.error("Delete book error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Internal server error" 
    };
  }
};