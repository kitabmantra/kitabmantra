import PostBookPage from "@/components/elements/desktop/forms/BookForm";
import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser";
import { redirect } from "next/navigation";

const Page = async () => {
    const user = await getCurrentUser()
    if (!user) redirect("/login")
    return <PostBookPage userId={user.userId} />
}
export default Page