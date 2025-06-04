import { ChangeBookStatus } from "@/lib/actions/books/update/change-book-status";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateBookStatusById= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ChangeBookStatus,
    onSuccess: (res) => {
        if(res.success){
            queryClient.invalidateQueries({ queryKey: ["get-user-book-by-id"] })
        }
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}