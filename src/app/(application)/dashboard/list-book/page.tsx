import ListBookPage from "@/components/elements/common/list-books/ListBookPage";
import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser";
import { redirect } from "next/navigation";

const Page = async () => {
    const user = await getCurrentUser()
    if (!user) redirect("/login")
    return <ListBookPage userId={user.userId} />
}
export default Page