/*eslint-disable*/
"use server"
import { getBookModel } from "@/lib/hooks/database/get-book-model"
import { getCurrentUser } from "../../user/get/getCurrentUser";
import { Book } from "@/lib/types/books";

export const getBooksByUser = async () => {
    const user = await getCurrentUser()
    if (!user) return { success: false }
    const bookModel = await getBookModel();
    const books = await bookModel.find({ userId: user.userId })
    if (!books) return { success: false }
    const formattedBooks: Book[] = books.map((book) => ({
        userId : book.userId,
        bookId: book._id.toString(),
        title: book.title,
        author: book.author,
        description: book.description,
        price: book.price,
        condition: book.condition,
        imageUrl: book.imageUrl,
        category: book.category,
        type: book.type,
        bookStatus :book.bookStatus,
        location: book.location,
        createdAt: book.createdAt,
    })) || []
    return { success: true, formattedBooks: JSON.stringify(formattedBooks) }

}




export const getUserBookByQuery = async (options: QueryType) => {
    const { page = 1, limit = 6, search = "", oldestFirst = false } = options;
    
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser){
            throw new Error()
        }
        const query: any = {
            userId : currentUser.userId
        };
        
        // Search across multiple fields
        if (search.trim()) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } }
            ];
        }

        const Book = await getBookModel();
        const validatedLimit = Math.min(Math.max(Number(limit), 6)); // Ensure limit <= 4
        const validatedPage = Math.max(Number(page), 1); // Ensure page >= 1
        const skip = (validatedPage - 1) * validatedLimit;
        const sortOrder = oldestFirst ? 1 : -1;

        const [books, totalBooks] = await Promise.all([
            Book.find(query)
                .skip(skip)
                .limit(validatedLimit)
                .sort({ createdAt: sortOrder })
                .lean()
                .exec(),
            Book.countDocuments(query).exec()
        ]);

        const totalPages = Math.ceil(totalBooks / validatedLimit) || 1;
        
        return {
            success: true,
            books : JSON.stringify(books), // No need to stringify here - let the JSON response handle it
            totalBooks,
            totalPages,
            currentPage: validatedPage,
            hasNextPage: validatedPage < totalPages,
            hasPrevPage: validatedPage > 1,
            limit: validatedLimit
        };
    } catch (error) {
        console.error("Error fetching books:", error);
        return {
            success: false,
            books: JSON.stringify([]),
            totalBooks: 0,
            totalPages: 0,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false,
            limit: Number(options.limit) || 6
        };
    }
};