import { BookActivityQueryType, getUserBookActivity } from "@/lib/actions/books/get/get-user-book-acitvity";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const fetchUserBookRequestActivity = async (query : BookActivityQueryType) => {
    const response = await getUserBookActivity(query);
    return {
        ...response,
        bookRequest : JSON.parse(response.bookRequest as string)
    }
}

export const useGetUserBookRequestActivity = (query : BookActivityQueryType) => {
  return useQuery({
    queryKey: ["get-user-books-request-activity", query],
    queryFn: () => fetchUserBookRequestActivity(query),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000, 
    gcTime: 5 * 60 * 1000, 
    retry: 2,
    retryDelay: 1000,
  });
}