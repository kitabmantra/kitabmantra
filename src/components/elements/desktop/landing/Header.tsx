import { Button } from '@/components/ui/button'
import { Menu, Search, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Logo from '../../common/logo/Logo'
import { Input } from '@/components/ui/input'

const Header = () => {
    return (
        < header className = "sticky top-0 z-50 w-full border-b bg-[#fcf9f2]/80 backdrop-blur-sm" >
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    <Link href="/" className="flex items-start gap-2 w-16 h-16 relative rounded-full border-2">
                        <Logo />
                    </Link>
                    <h1 className="font-medium text-lg">Kitab Mantra</h1>
                </div>
                <nav className="hidden gap-6 md:flex relative z-10">
                    <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
                        Home
                    </Link>
                    <Link href="/marketplace" className="text-sm font-medium hover:underline underline-offset-4">
                        Books
                    </Link>
                    <Link href="/#categories" className="text-sm font-medium hover:underline underline-offset-4">
                        Categories
                    </Link>
                    <Link href="/#about" className="text-sm font-medium hover:underline underline-offset-4">
                        About
                    </Link>
                    <Link href="/#contact" className="text-sm font-medium hover:underline underline-offset-4">
                        Contact
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <form className="hidden items-center lg:flex">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search books..."
                                className="w-60 rounded-full bg-white pl-8 md:w-80"
                            />
                        </div>
                    </form>
                    <Button variant="ghost" size="icon" className="text-amber-700 relative z-10">
                        <Link href="/login">
                            <User className="h-5 w-5" />
                        </Link>
                        <span className="sr-only">Account</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-amber-700 relative z-10">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="sr-only">Cart</span>
                    </Button>
                </div>
            </div>
</header >
  )
}

export default Header
