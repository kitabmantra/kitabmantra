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
                "flex h-[calc(100vh-2rem)] flex-col border-r bg-gradient-to-b from-white to-[#1E3A8A]/5 transition-all duration-300 ease-in-out overflow-hidden",
                collapsed ? "w-16" : "w-64",
            )}
        >
            <div className="flex h-16 items-center justify-between border-b px-4 bg-gradient-to-r from-[#1E3A8A]/10 to-transparent">
                <div className="flex items-center space-x-2">
                    {!collapsed ? (
                        <h2 className="text-lg font-semibold whitespace-nowrap bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] bg-clip-text text-transparent">
                            Kitab Mantra
                        </h2>
                    ) : (
                        <h2 className="text-sm font-bold whitespace-nowrap bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] bg-clip-text text-transparent">
                            KM
                        </h2>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex h-6 w-6 hover:bg-[#1E3A8A]/10 hover:text-[#1E3A8A]"
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
                                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300",
                                                        isActive 
                                                            ? "bg-gradient-to-r from-[#1E3A8A]/20 to-[#0D9488]/20 text-[#1E3A8A]" 
                                                            : "text-[#4B5563] hover:bg-gradient-to-r hover:from-[#1E3A8A]/10 hover:to-[#0D9488]/10 hover:text-[#1E3A8A]",
                                                        collapsed ? "justify-center" : ""
                                                    )}
                                                >
                                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                                    <span
                                                        className={cn(
                                                            "transition-all duration-300 whitespace-nowrap overflow-hidden",
                                                            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                                                        )}
                                                    >
                                                        {item.title}
                                                    </span>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" sideOffset={10} className="bg-white border-[#1E3A8A]/10">
                                                <p className="text-[#1E3A8A]">{item.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-300",
                                            isActive 
                                                ? "bg-gradient-to-r from-[#1E3A8A]/20 to-[#0D9488]/20 text-[#1E3A8A]" 
                                                : "text-[#4B5563] hover:bg-gradient-to-r hover:from-[#1E3A8A]/10 hover:to-[#0D9488]/10 hover:text-[#1E3A8A]"
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
            <div className="border-t bg-gradient-to-t from-[#1E3A8A]/5 to-transparent">
                <UserDropdown user={user} collapsed={collapsed} />
            </div>
        </aside>
    )
}