"use client"

import { Button } from "@/components/ui/button"
import { navItems } from "@/db/NavItems"
import { cn } from "@/lib/utils"
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UserDropdown } from "../../auth/logout"

interface DSidebarProps {
    user: User
}

export function DSidebar({ user }: DSidebarProps) {
    const pathname = usePathname()
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            className={cn(
                "flex h-[calc(100vh-2rem)] flex-col border-r bg-background transition-all duration-300 ease-in-out overflow-hidden",
                collapsed ? "w-16" : "w-64",
            )}
        >
            <div className="flex h-16 items-center justify-between border-b px-4">

                <div className="flex items-center space-x-2">
                    {!collapsed ? (
                        <h2 className="text-lg font-semibold whitespace-nowrap">
                            Kitab Mantra
                        </h2>
                    ) : (
                        <h2 className="text-sm font-bold whitespace-nowrap">
                            KM
                        </h2>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex h-6 w-6"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    <span className="sr-only">{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
                </Button>
            </div>
            <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <li key={item.href} onMouseOver={() => router.prefetch(`${item.href}`)}>
                                {collapsed ? (
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                                        collapsed && "justify-center px-0",
                                                    )}
                                                >
                                                    <item.icon className="h-5 w-5" />
                                                    <span className="sr-only">{item.title}</span>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" sideOffset={10}>
                                                <p>{item.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                            isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 mr-3" />
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </nav>
            <UserDropdown user={user} collapsed={collapsed} />
        </aside>
    )
}