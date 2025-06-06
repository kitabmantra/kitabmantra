import { getBooks, GetBooksOptions } from "@/lib/actions/books/get/getAllBooksWithQuery";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const fetchBookFromQuery = async (query: GetBooksOptions) => {
  const response = await getBooks(query);
  return {
    ...response,
    books: JSON.parse(response.books as string)
  };
}

export const useGetBooks = (query: GetBooksOptions) => {
  return useQuery({
    queryKey: ["get-book-from-query", query],
    queryFn: () => fetchBookFromQuery(query),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
}