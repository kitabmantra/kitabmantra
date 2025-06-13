/*eslint-disable*/
"use server"
import { getBookRequestModel } from "@/lib/hooks/database/get-book-request-model";
import { getCurrentUser } from "../../user/get/getCurrentUser";

export type BookActivityQueryType = {
    page: number
    limit: number
    search: string
    field: 'all' | 'requests' | 'sold' | 'bought'
}

export const getUserBookActivity = async (options: BookActivityQueryType) => {
    const { page = 1, limit = 30, search = "", field = "all" } = options;
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.userId) {
            throw new Error();
        };
        const query: any = {};

        if (search.trim()) {
            query.$text = { $search: search.trim() }
        }

        // Base query conditions for current view
        switch (field) {
            case "sold":
                query.bookOwnerId = currentUser.userId;
                query.requestStatus = { $ne: "pending" };
                break;
            case "bought":
                query.customerId = currentUser.userId;
                query.requestStatus = { $ne: "pending" };
                break;
            case "requests":
                query.requestStatus = "pending";
                query.$or = [
                    { customerId: currentUser.userId },
                    { bookOwnerId: currentUser.userId }
                ];
                break;
            default: // "all"
                query.$or = [
                    { bookOwnerId: currentUser.userId },
                    { customerId: currentUser.userId }
                ];
        }

        const BookRequest = await getBookRequestModel();
        const validatedLimit = Math.min(Math.max(Number(limit), 30)); 
        const validatedPage = Math.max(Number(page), 1); 
        const skip = (validatedPage - 1) * validatedLimit;

        // Count queries for all categories
        const countQueries = {
            all: { $or: [{ bookOwnerId: currentUser.userId }, { customerId: currentUser.userId }] },
            sold: { bookOwnerId: currentUser.userId, requestStatus: { $ne: "pending" } },
            bought: { customerId: currentUser.userId, requestStatus: { $ne: "pending" } },
            requests: { 
                requestStatus: "pending",
                $or: [
                    { customerId: currentUser.userId },
                    { bookOwnerId: currentUser.userId }
                ]
            }
        };

        const [bookRequest, totalBooks, totalSold, totalBought, totalRequests] = await Promise.all([
            BookRequest.find(query)
                .skip(skip)
                .limit(validatedLimit)
                .sort({ createdAt: -1 })
                .lean()
                .exec(),
            BookRequest.countDocuments(countQueries.all).exec(),
            BookRequest.countDocuments(countQueries.sold).exec(),
            BookRequest.countDocuments(countQueries.bought).exec(),
            BookRequest.countDocuments(countQueries.requests).exec()
        ]);

        const totalPages = Math.ceil(totalBooks / validatedLimit) || 1;

        return {
            success: true,
            bookRequest: JSON.stringify(bookRequest),
            totalBooks,
            totalPages,
            currentPage: validatedPage,
            hasNextpage: validatedPage < totalPages,
            hasPrevPage: validatedPage > 1,
            limit: validatedLimit,
            counts: {
                all: totalBooks,
                sold: totalSold,
                bought: totalBought,
                requests: totalRequests
            }
        }

    } catch (error) {
        console.error("Error fetching books request:", error);
        return {
            success: false,
            books: JSON.stringify([]),
            totalBooks: 0,
            totalPages: 0,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false,
            limit: Number(options.limit) || 6,
            counts: {
                all: 0,
                sold: 0,
                bought: 0,
                requests: 0
            }
        };
    }
}