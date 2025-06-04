"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetUserFromSession } from "@/lib/hooks/tanstack-query/query-hook/user/use-get-user-session"
import { handleLogOut } from "@/lib/actions/auth/sign-out"

export default function Header() {
    const { data: session, refetch } = useGetUserFromSession()
    
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { scrollY } = useScroll()
    const headerOpacity = useTransform(scrollY, [0, 100], [0, 1])
    const headerY = useTransform(scrollY, [0, 100], [-20, 0])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const getDashboardLink = () => {
        if (!session) return "/login"
        else return "/dashboard"
        return "/"
    }

    const navVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 }
    }

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setIsMenuOpen(false)
        }
    }

    return (
        <motion.header 
            style={{ 
                opacity: headerOpacity,
                y: headerY,
                backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none'
            }}
            className="fixed top-0 z-50 w-full transition-all duration-300"
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-20 items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <Link href="/" className="flex items-center space-x-2">
                            <motion.span 
                                className="text-2xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] bg-clip-text text-transparent"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                Kitab Mantra
                            </motion.span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <motion.nav 
                        variants={navVariants}
                        initial="hidden"
                        animate="visible"
                        className="hidden md:flex items-center space-x-8"
                    >
                        {["Browse Books", "About", "Contact"].map((item) => (
                            <motion.div key={item} variants={itemVariants}>
                                {item === "Browse Books" ? (
                                    <Link
                                        href="/marketplace"
                                        className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#0D9488] relative group"
                                    >
                                        {item}
                                        <motion.span 
                                            className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0D9488] group-hover:w-full transition-all duration-300"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: "100%" }}
                                        />
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => scrollToSection(item.toLowerCase())}
                                        className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#0D9488] relative group"
                                    >
                                        {item}
                                        <motion.span 
                                            className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0D9488] group-hover:w-full transition-all duration-300"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: "100%" }}
                                        />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </motion.nav>

                    {/* Desktop Auth Buttons */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hidden md:flex items-center space-x-4"
                    >
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.image || ""} alt={session.name || ""} />
                                            <AvatarFallback>
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{session.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link href={getDashboardLink()}>
                                        <DropdownMenuItem className="cursor-pointer">
                                            Dashboard
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/dashboard/settings">
                                        <DropdownMenuItem className="cursor-pointer">
                                            Settings
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                        onClick={() => {
                                            handleLogOut()
                                            refetch()
                                        }}
                                    >
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        className="relative overflow-hidden border-[#1E3A8A] text-[#1E3A8A] hover:text-[#0D9488] hover:border-[#0D9488] transition-all duration-200 group"
                                    >
                                        <motion.span
                                            className="absolute inset-0 bg-[#0D9488] opacity-0 group-hover:opacity-10 transition-opacity duration-200"
                                            initial={{ scale: 0 }}
                                            whileHover={{ scale: 1 }}
                                        />
                                        Sign In
                                    </Button>
                                </Link>
                               
                            </>
                        )}
                    </motion.div>

                    {/* Mobile Menu Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="md:hidden"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative z-50"
                        >
                            <AnimatePresence mode="wait">
                                {isMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="h-5 w-5 text-[#1E3A8A]" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="h-5 w-5 text-[#1E3A8A]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden border-t border-[#1E3A8A]/10 bg-white/95 backdrop-blur-sm"
                    >
                        <motion.div 
                            className="container mx-auto px-4 py-4 space-y-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <nav className="flex flex-col space-y-4">
                                {["Browse Books", "About", "Contact"].map((item, index) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {item === "Browse Books" ? (
                                            <Link
                                                href="/marketplace"
                                                className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#0D9488]"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {item}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    scrollToSection(item.toLowerCase())
                                                    setIsMenuOpen(false)
                                                }}
                                                className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#0D9488] w-full text-left"
                                            >
                                                {item}
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </nav>
                            <motion.div 
                                className="flex flex-col space-y-2 pt-4 border-t border-[#1E3A8A]/10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {session ? (
                                    <>
                                        <Link href={getDashboardLink()} className="w-full" onClick={() => setIsMenuOpen(false)}>
                                            <Button className="w-full bg-[#1E3A8A] text-white hover:bg-[#0D9488]">
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="outline"
                                            className="w-full border-red-600 text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                                handleLogOut()
                                                refetch()
                                                setIsMenuOpen(false)
                                            }}
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                                            <Button
                                                variant="outline"
                                                className="w-full border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#F9FAFB] hover:text-[#0D9488] hover:border-[#0D9488]"
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                       
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}