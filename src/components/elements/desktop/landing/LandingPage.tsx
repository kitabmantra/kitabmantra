import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Mail,
    MapPin,
    Menu,
    Phone,
    Search,
    ShoppingCart,
    User,
} from "lucide-react"

export default function LandingPage() {
    return (
        <div className="flex min-h-[100dvh] flex-col bg-[#fcf9f2]">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-[#fcf9f2]/80 backdrop-blur-sm">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-amber-700" />
                            <span className="text-xl font-bold">Kitab Mantra</span>
                        </Link>
                    </div>
                    <nav className="hidden gap-6 md:flex">
                        <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
                            Home
                        </Link>
                        <Link href="#books" className="text-sm font-medium hover:underline underline-offset-4">
                            Books
                        </Link>
                        <Link href="#categories" className="text-sm font-medium hover:underline underline-offset-4">
                            Categories
                        </Link>
                        <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
                            About
                        </Link>
                        <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4">
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
                        <Button variant="ghost" size="icon" className="text-amber-700">
                            <Link href="/login">
                                <User className="h-5 w-5" />
                            </Link>
                            <span className="sr-only">Account</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-amber-700">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Cart</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative">
                    <div className="container px-4 py-12 md:px-6 md:py-24 lg:py-32">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                                        Discover Your Next Favorite Book
                                    </h1>
                                    <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                        Explore our vast collection of bestsellers, classics, and hidden gems. Your literary journey begins
                                        here.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link
                                        href="#books"
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-amber-700 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        Browse Books
                                    </Link>
                                    <Link
                                        href="#about"
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        About Us
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <Image
                                    src="/placeholder.svg?height=400&width=600"
                                    width={600}
                                    height={400}
                                    alt="Bookstore interior with shelves of books"
                                    className="rounded-lg object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Books */}
                <section id="books" className="bg-white py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Books</h2>
                                <p className="text-gray-600">Handpicked selections from our latest collection</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="sr-only">Previous</span>
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="sr-only">Next</span>
                                </Button>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {[1, 2, 3, 4].map((book) => (
                                <div
                                    key={book}
                                    className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
                                >
                                    <Link href="#" className="absolute inset-0 z-10">
                                        <span className="sr-only">View Book</span>
                                    </Link>
                                    <div className="aspect-[2/3] w-full overflow-hidden">
                                        <Image
                                            src={`/placeholder.svg?height=450&width=300&text=Book%20${book}`}
                                            width={300}
                                            height={450}
                                            alt={`Book cover ${book}`}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold">The Great Adventure</h3>
                                        <p className="text-sm text-gray-600">Author Name</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="font-bold text-amber-700">$19.99</span>
                                            <Button size="sm" className="bg-amber-700 hover:bg-amber-800">
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-center">
                            <Link
                                href="#"
                                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                View All Books
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section id="categories" className="bg-amber-50 py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Browse by Category</h2>
                                <p className="text-gray-600 md:text-lg">Find your perfect read by exploring our book categories</p>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {[
                                "Fiction",
                                "Non-Fiction",
                                "Mystery",
                                "Sci-Fi",
                                "Romance",
                                "Biography",
                                "History",
                                "Self-Help",
                                "Children",
                                "Poetry",
                                "Cooking",
                                "Art",
                            ]
                                .slice(0, 6)
                                .map((category) => (
                                    <Link
                                        key={category}
                                        href="#"
                                        className="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md hover:bg-amber-100"
                                    >
                                        <div className="mb-2 rounded-full bg-amber-100 p-2">
                                            <BookOpen className="h-6 w-6 text-amber-700" />
                                        </div>
                                        <h3 className="text-sm font-medium">{category}</h3>
                                    </Link>
                                ))}
                        </div>
                        <div className="mt-8 flex justify-center">
                            <Link
                                href="#"
                                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                All Categories
                            </Link>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="bg-white py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                            <div className="flex items-center justify-center">
                                <Image
                                    src="/placeholder.svg?height=400&width=600"
                                    width={600}
                                    height={400}
                                    alt="Bookstore staff arranging books"
                                    className="rounded-lg object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Story</h2>
                                    <p className="text-gray-600 md:text-lg">
                                        Kitab Mantra was founded in 2005 with a simple mission: to connect readers with stories that
                                        inspire, educate, and entertain.
                                    </p>
                                    <p className="text-gray-600">
                                        What started as a small corner shop has grown into a beloved community hub for book lovers. We
                                        carefully curate our collection to include diverse voices and perspectives, ensuring there&apso;s
                                        something for every reader.
                                    </p>
                                    <p className="text-gray-600">
                                        Our knowledgeable staff are passionate about literature and always ready to help you find your next
                                        great read. We also host regular events, book clubs, and author signings to foster a vibrant
                                        literary community.
                                    </p>
                                </div>
                                <div>
                                    <Link
                                        href="#contact"
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-amber-700 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        Visit Us
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="bg-amber-50 py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What Our Customers Say</h2>
                                <p className="text-gray-600 md:text-lg">Hear from our community of book lovers</p>
                            </div>
                        </div>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    name: "Sarah Johnson",
                                    quote:
                                        "Kitab Mantra has been my go-to bookstore for years. The staff recommendations are always spot on!",
                                },
                                {
                                    name: "Michael Chen",
                                    quote:
                                        "I love the cozy atmosphere and the carefully curated selection. It's easy to spend hours browsing here.",
                                },
                                {
                                    name: "Emma Rodriguez",
                                    quote:
                                        "The book club meetings have introduced me to so many great books I wouldn't have discovered otherwise.",
                                },
                            ].map((testimonial, index) => (
                                <div key={index} className="rounded-lg bg-white p-6 shadow-sm">
                                    <blockquote className="space-y-2">
                                        <p className="text-gray-600">{testimonial.quote}</p>
                                        <footer className="text-sm font-medium">— {testimonial.name}</footer>
                                    </blockquote>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter */}
                <section className="bg-amber-700 py-12 md:py-24 text-white">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Join Our Newsletter</h2>
                                <p className="md:text-lg">Stay updated with new releases, events, and exclusive offers</p>
                            </div>
                            <div className="mx-auto w-full max-w-md space-y-2">
                                <form className="flex space-x-2">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="max-w-lg flex-1 bg-white/10 text-white placeholder:text-white/70 focus-visible:ring-amber-500"
                                    />
                                    <Button type="submit" className="bg-white text-amber-700 hover:bg-white/90">
                                        Subscribe
                                    </Button>
                                </form>
                                <p className="text-xs text-white/70">We respect your privacy. Unsubscribe at any time.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact/Location */}
                <section id="contact" className="bg-white py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Visit Our Store</h2>
                                    <p className="text-gray-600 md:text-lg">
                                        We&apso;d love to welcome you to our bookstore. Come browse our shelves and discover your next favorite
                                        book.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="h-5 w-5 text-amber-700" />
                                        <div>
                                            <h3 className="font-medium">Address</h3>
                                            <p className="text-gray-600">123 Reading Lane, Bookville, BK 12345</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Phone className="h-5 w-5 text-amber-700" />
                                        <div>
                                            <h3 className="font-medium">Phone</h3>
                                            <p className="text-gray-600">(555) 123-4567</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Mail className="h-5 w-5 text-amber-700" />
                                        <div>
                                            <h3 className="font-medium">Email</h3>
                                            <p className="text-gray-600">hello@pageturnerbooks.com</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Hours</h3>
                                        <div className="mt-1 grid grid-cols-2 gap-x-4 text-gray-600">
                                            <div>Monday - Friday</div>
                                            <div>9:00 AM - 8:00 PM</div>
                                            <div>Saturday</div>
                                            <div>10:00 AM - 7:00 PM</div>
                                            <div>Sunday</div>
                                            <div>12:00 PM - 6:00 PM</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-lg">
                                <Image
                                    src="/placeholder.svg?height=450&width=800&text=Map"
                                    width={800}
                                    height={450}
                                    alt="Map showing bookstore location"
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t bg-[#fcf9f2]">
                <div className="container px-4 py-8 md:px-6 md:py-12">
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-6 w-6 text-amber-700" />
                                <span className="text-xl font-bold">Kitab Mantra</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Your neighborhood bookstore since 2005. Connecting readers with stories that matter.
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-3 text-sm font-medium">Shop</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>
                                    <Link href="#" className="hover:underline">
                                        New Releases
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">
                                        Bestsellers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">
                                        Staff Picks
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">
                                        Gift Cards
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-3 text-sm font-medium">About</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>
                                    <Link href="#" className="hover:underline">
                                        Our Story
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">
                                        Events
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">
                                        Book Clubs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">
                                        Careers
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-3 text-sm font-medium">Support</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>
                                    <Link href="#" className="hover:underline">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">
                                        Shipping & Returns
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
                        <p className="text-xs text-gray-600">© {new Date().getFullYear()} Kitab Mantra. All rights reserved.</p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-gray-600 hover:text-amber-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-amber-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-amber-700">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                </svg>
                                <span className="sr-only">Twitter</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
