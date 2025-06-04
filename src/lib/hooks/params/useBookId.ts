import { useParams } from "next/navigation";

export const useBookId = () =>{
    const params = useParams<{bookId : string}>();
    return params.bookId;
}