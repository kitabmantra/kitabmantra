import { UpdateHitCounter } from "@/lib/actions/hitcount/put/updateHitConter";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function serverUpdateHitCount() {
    const response = await UpdateHitCounter()
    return response
}
export const useUpdateHitCount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: serverUpdateHitCount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-count"] })
        }
    })
}  