import { getBooksByUser, getUserBookByQuery } from "@/lib/actions/books/get/getBooksByUser";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const fetchUserBooks = async (query : QueryType) => {
    const response = await getUserBookByQuery(query);
    return {
        ...response,
        books : JSON.parse(response.books)
    }
}

export const useGetUserBooks = (query : QueryType) => {
  return useQuery({
    queryKey: ["get-user-books"],
    queryFn: () => fetchUserBooks(query),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000, 
    gcTime: 5 * 60 * 1000, 
    retry: 2,
    retryDelay: 1000,
  });
}