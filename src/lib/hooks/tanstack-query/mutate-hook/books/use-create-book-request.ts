import { createBookRequest } from "@/lib/actions/books/post/createBookRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCreateBookRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBookRequest,
    onSuccess: (res) => {
        if(res.success){
            queryClient.invalidateQueries({ queryKey: ["get-book-request-status"] })
        }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}