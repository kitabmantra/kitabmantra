import { cancelBookingRequest } from "@/lib/actions/books/delete/cancel-booking-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useCancelBookRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBookingRequest,
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