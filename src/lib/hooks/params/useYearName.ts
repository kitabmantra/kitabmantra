import { useParams } from "next/navigation";

export const useYearName = () =>{
    const params = useParams<{yearValue : string}>();
    return params.yearValue;
}