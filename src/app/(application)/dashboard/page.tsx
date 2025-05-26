import DashboardPage from "@/components/elements/common/dashboard/DashboardPage";
import { getCurrentUser } from "@/lib/actions/user/get/getCurrentUser";
import { redirect } from "next/navigation";

const Page = async () => {
    const user = await getCurrentUser()
    if (!user) redirect("/login")
    return <DashboardPage userId={user.userId} />
}
export default Page