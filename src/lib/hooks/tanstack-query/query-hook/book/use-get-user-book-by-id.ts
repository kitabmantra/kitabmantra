import { getOneUserBook } from "@/lib/actions/books/get/getOneUserBook";
import { PublicBook } from "@/lib/types/books";
import { useQuery } from "@tanstack/react-query";

export const fetchUserBookById= async (id : string) => {
  const response = await getOneUserBook(id);
  return {
    success : response.success,
    book : {
    ...response.formattedbookData,
    category : JSON.parse(response.formattedbookData?.category as string),
    location : JSON.parse(response.formattedbookData?.location as string)
  } as PublicBook
  }
}

export const useGetUserBookById = (id : string) => {
  return useQuery({
    queryKey: ["get-user-book-by-id", id],
    queryFn: () => fetchUserBookById(id),
  });
}