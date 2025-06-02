import { deleteBook } from "@/lib/actions/books/delete/deleteBook";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeleteBookById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBook,
    onSuccess: (res) => {
        if(res.success){
            queryClient.invalidateQueries({ queryKey: ["get-user-books"] })
        }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}