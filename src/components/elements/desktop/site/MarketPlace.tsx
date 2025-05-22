"use client"
import toast from 'react-hot-toast'
import { BookCard } from './books/BookCard'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CategoryFilter } from './books/CategoryFilter'

interface MarketPlaceProps {
    success: boolean,
    allBooks: PublicBook[]
}

const MarketPlace = ({
    success,
    allBooks
}: MarketPlaceProps) => {
    if (!success) toast.error("Something went wrong!")
    const [book, setBooks] = useState<PublicBook[]>(allBooks)
    const [sortOption, setSortOption] = useState("newest")
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        level: "",
        faculty: "",
        year: "",
        classNum: ""
    });


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchQuery(e.target.value)
    }

    useEffect(() => {
        let filteredBooks = allBooks.filter((book) => {
            const bookCategory = JSON.parse(book.category || "{}");
            const bookLocation = JSON.parse(book.location || "");

            const matchesSearch =
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bookLocation.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilters =
                (!filters.level || bookCategory.level === filters.level) &&
                (!filters.faculty || bookCategory.faculty === filters.faculty) &&
                (!filters.year || bookCategory.year === filters.year) &&
                (!filters.classNum || bookCategory.class === filters.classNum);

            return matchesSearch && matchesFilters;
        });

        // Apply sorting
        if (sortOption === "newest") {
            filteredBooks = [...filteredBooks].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        } else if (sortOption === "oldest") {
            filteredBooks = [...filteredBooks].sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
        } else if (sortOption === "price-low") {
            filteredBooks = [...filteredBooks].sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-high") {
            filteredBooks = [...filteredBooks].sort((a, b) => b.price - a.price);
        }

        setBooks(filteredBooks);
    }, [searchQuery, sortOption, filters, allBooks]);


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Find Your Books</h1>
                    <p className="text-muted-foreground mt-1">Browse, buy, sell, and exchange books with students near you</p>
                </div>

                <div className="w-full md:w-auto flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search books..."
                            className="pl-8"
                            onChange={handleSearch}
                        />
                    </div>
                    <Link href="/post-book">
                        <Button>Post a Book</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 relative">
                    <CategoryFilter onFilterChange={setFilters}/>
                </div>
                <div className="md:col-span-3">
                    {book.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border">
                            <h2 className="text-xl font-medium mb-2">No books found</h2>
                            <p className="text-muted-foreground mb-4">Try adjusting your filters or post a book yourself!</p>
                            <Link href="/post-book">
                                <Button>Post a Book</Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-muted-foreground">
                                    Showing <span className="font-medium text-foreground">{allBooks.length}</span> books
                                </p>
                                <select
                                    className="text-sm border rounded-md px-2 py-1"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {
                                    book && book.length > 0 ? (
                                        book.map(book => (
                                            <BookCard key={book.bookId} success={success} book={book} />
                                        ))
                                    ) : (
                                        <span>No Books Found!</span>
                                    )
                                }
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MarketPlace
