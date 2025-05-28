import { getUserFromSession } from "@/lib/actions/user/get/getUserFromSession";
import { getUserModel } from "@/lib/hooks/database/get-user-model";
import { useQuery } from "@tanstack/react-query";

export  const fetchUserFromSession = async( ) =>{
    const response = await getUserFromSession();
    return response;
}

export const useGetUserFromSession = () =>{
    return useQuery({
        queryKey : ["get-user-from-session"],
        queryFn : () => fetchUserFromSession(),
    })
}