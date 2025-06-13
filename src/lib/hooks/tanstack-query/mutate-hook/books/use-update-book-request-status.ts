import { updateBookRequestStatus } from "@/lib/actions/books/put/update-book-request-status";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateBookRequestStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBookRequestStatus,
    onSuccess: (res) => {
        if(res.success){
            queryClient.invalidateQueries({ queryKey: ["get-user-books-request-activity"] })
        }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}