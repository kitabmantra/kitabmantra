import { BarChart2, BookOpen, LayoutDashboard, ListChecks, MessageCircle, MessageSquare } from "lucide-react"

type NavItem = {
    title: string
    href: string
    icon: React.ElementType
}

export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "List Book",
        href: "/dashboard/list-book",
        icon: BookOpen,
    },
    {
        title: "My Listings",
        href: "/dashboard/my-listings",
        icon: ListChecks,
    },
    {
        title: "Chats",
        href: "/dashboard/chats",
        icon: MessageSquare,
    },
    {
        title: "Comments",
        href: "/dashboard/comments",
        icon: MessageCircle,
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart2,
    },
]