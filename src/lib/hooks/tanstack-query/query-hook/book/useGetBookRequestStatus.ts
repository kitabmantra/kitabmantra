import { getBookRequestStatus } from "@/lib/actions/books/get/getBookRequestStatus";
import {  useQuery } from "@tanstack/react-query";

export const  fetchBookRequestStatus= async ({bookId , userId} : {bookId : string, userId ?: string}) => {
    const response = await getBookRequestStatus({bookId, userId});
    return response;
}

export const useGetBookRequestStatus = ({bookId, userId} : {bookId : string, userId ?: string}) => {
  return useQuery({
    queryKey: ["get-book-request-status"],
    queryFn: () => fetchBookRequestStatus({bookId, userId}),
  });
}