import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useGetUserFromSession } from "@/lib/hooks/tanstack-query/query-hook/user/use-get-user-session";
import { GetYearQueryType } from "@/components/elements/desktop/application/admin/quiz/year/YearListpage";
import { getErrorMessage } from "@/lib/utils/get-error";

export const fetchAcademicYear = async (data : GetYearQueryType) => {
  try { 
    const response = await axios.get(`/api/get/cateogry/academic/year?typeName=${data.typeName}&levelName=${data.levelName}&faculty=${data.faculty}`);
    return response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    return {
      success: false,
      error: errorMessage
    }
  }
};

export const useGetAcademicYear = (data : GetYearQueryType) => {
  const { data: session } = useGetUserFromSession();

  return useQuery({
    queryKey: ["get-academic-year", data.typeName, data.levelName, data.faculty],
        queryFn: () => fetchAcademicYear(data),
    enabled: !!session,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes in milliseconds
    placeholderData: keepPreviousData
  });
};
