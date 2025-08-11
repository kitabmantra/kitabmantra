import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGetUserFromSession } from "@/lib/hooks/tanstack-query/query-hook/user/use-get-user-session";

export const fetchAcademicCategory = async () => {
  const response = await axios.get(`/api/get/cateogry/academic`);
  return response.data;
};

export const useGetAcademicCategory = () => {
  const { data: session } = useGetUserFromSession();

  return useQuery({
    queryKey: ["get-academic-category"],
    queryFn: fetchAcademicCategory,
    enabled: !!session,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
    placeholderData: keepPreviousData
  });
};
