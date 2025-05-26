"use client"

import { Button } from "@/components/ui/button"
import { navItems } from "@/db/NavItems"
import { cn } from "@/lib/utils"
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface DSidebarProps {
    user: User
}

export function DSidebar({ user }: DSidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            className={cn(
                "flex h-[calc(100vh-2rem)] w-64 flex-col border-r bg-background transition-all duration-300 ease-in-out",
                collapsed ? "w-16" : "w-64",
            )}
        >
            <div className="flex h-16 items-center justify-between border-b px-4">
                <h2 className={cn("text-lg font-semibold", collapsed && "hidden")}>BookApp</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    <span className="sr-only">{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
                </Button>
            </div>

            <nav className="flex-1 overflow-y-auto p-2">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                        collapsed && "justify-center px-0"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                                    {!collapsed && <span>{item.title}</span>}
                                    {collapsed && <span className="sr-only">{item.title}</span>}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="border-t p-4">
                <div className={cn("flex items-center", collapsed && "justify-center")}>
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    {!collapsed && (
                        <div className="ml-3">
                            <p className="text-sm font-medium">{user.userName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )
}
