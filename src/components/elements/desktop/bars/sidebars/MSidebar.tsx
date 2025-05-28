"use client"

import { navItems } from "@/db/NavItems"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
interface MSidebarProps {
    user: User
}

export function MSidebar({ user }: MSidebarProps) {
    console.log(user)
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        setMounted(true)
        const currentIndex = navItems.findIndex((item) => item.href === pathname)
        setActiveIndex(currentIndex >= 0 ? currentIndex : 0)
    }, [pathname])

    return (
        <aside
            className={`
      fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 safe-area-pb
      transform transition-all duration-500 ease-out
      ${mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
    `}
        >
          
            <div
                className="absolute top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                style={{
                    width: `${100 / navItems.length}%`,
                    left: `${(activeIndex * 100) / navItems.length}%`,
                }}
            />

            <nav className="px-2 py-1 relative">
                <ul className="flex items-center justify-around">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href
                        return (
                            <li 
                            key={item.href} 
                            className="flex-1"
                            onMouseOver={()=>router.prefetch(`${item.href}`)}
                            >
                                <Link
                                    href={item.href}
                                    className={`
                    group flex flex-col items-center justify-center py-2 px-1 rounded-lg 
                    transition-all duration-300 ease-out min-h-[60px] relative overflow-hidden
                    transform hover:scale-105 active:scale-95
                    ${isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}
                  `}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    {/* Background ripple effect */}
                                    <div
                                        className={`
                    absolute inset-0 rounded-lg transition-all duration-300 ease-out
                    ${isActive
                                                ? "bg-blue-50 scale-100 opacity-100"
                                                : "bg-gray-50 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                                            }
                  `}
                                    />

                                    <div
                                        className={`
                    relative z-10 transition-all duration-300 ease-out
                    ${isActive ? "animate-bounce-subtle" : "group-hover:animate-pulse-gentle"}
                  `}
                                    >
                                        <item.icon
                                            className={`
                        w-5 h-5 mb-1 transition-all duration-300 ease-out
                        ${isActive ? "text-blue-600 drop-shadow-sm" : "text-gray-500 group-hover:text-gray-700"}
                      `}
                                        />
                                    </div>

                                    <span
                                        className={`
                      relative z-10 text-[10px] font-medium truncate max-w-full
                      transition-all duration-300 ease-out
                      ${isActive
                                                ? "text-blue-600 font-semibold transform scale-105"
                                                : "text-gray-600 group-hover:text-gray-900"
                                            }
                    `}
                                    >
                                        {item.title}
                                    </span>

                                    <div
                                        className={`
                    w-1 h-1 bg-blue-600 rounded-full mt-1 transition-all duration-300 ease-out
                    ${isActive ? "scale-100 opacity-100 animate-pulse-dot" : "scale-0 opacity-0"}
                  `}
                                    />

                                    <div className="absolute inset-0 rounded-lg bg-blue-200 scale-0 opacity-0 group-active:scale-100 group-active:opacity-30 transition-all duration-150 ease-out" />
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="absolute -top-4 left-0 right-0 h-4 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
        </aside>
    )
}
