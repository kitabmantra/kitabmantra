"use client"

import { MSidebar } from "./MSidebar"
import { DSidebar } from "./DSidebar"
import { useMediaQuery } from "@/lib/hooks/responsive/useMediaQuery";

interface SidebarProps {
    user: User;
}
export default function Sidebar({
    user
}: SidebarProps) {
    const isDesktop = useMediaQuery("(min-width: 640px)")
    if (isDesktop === null) {
        return null
    }

    return isDesktop ? <DSidebar user={user} /> : <MSidebar user={user} />
}
