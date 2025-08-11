import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGetUserFromSession } from "@/lib/hooks/tanstack-query/query-hook/user/use-get-user-session";

export const fetchLevelFaculty = async (typeName: string, levelName: string) => {
  const response = await axios.get(`/api/get/cateogry/academic/faculty?typeName=${typeName}&levelName=${levelName}`);
  console.log("response : ",response)
  return response.data;
};

export const useGetLevelFaculty = (typeName: string, levelName: string) => {
  const { data: session } = useGetUserFromSession();

  return useQuery({
    queryKey: ["get-level-faculty"],
        queryFn: () => fetchLevelFaculty(typeName, levelName),
    enabled: !!session,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
    placeholderData: keepPreviousData
  });
};
