
"use client"
import toast from 'react-hot-toast'
import { BookCard } from './books/BookCard'
import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CategoryFilter } from './books/CategoryFilter'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { PublicBook } from '@/lib/types/books'

interface MarketPlaceProps {
  success: boolean
  allBooks: string
}


interface Filters {
  level: string
  faculty: string
  year: string
  classNum: string
}

const MarketPlace = ({ success, allBooks }: MarketPlaceProps) => {
  if (!success) toast.error("Something went wrong!")

  const bookData: PublicBook[] = useMemo(() => JSON.parse(allBooks), [allBooks])
  const [filteredBooks, setFilteredBooks] = useState<PublicBook[]>(bookData)
  const [sortOption, setSortOption] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({ level: "", faculty: "", year: "", classNum: "" })

  useEffect(() => {
    let result = [...bookData]

    if (searchQuery.trim()) {
      result = result.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    result = result.filter(book => {
      const category = book.category || {}
      return (
        (!filters.level || category.level === filters.level) &&
        (!filters.faculty || category.faculty === filters.faculty) &&
        (!filters.year || category.year === filters.year) &&
        (!filters.classNum || category.class === filters.classNum)
      )
    })

    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
    }

    setFilteredBooks(result)
  }, [searchQuery, sortOption, filters, bookData])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Find Your Books</h1>
          <p className="text-muted-foreground mt-1">
            Browse, buy, sell, and exchange books with students near you
          </p>
        </div>

        <div className="w-full md:w-auto flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search books..."
              className="pl-8"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>

          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Link href="/post-book">
            <Button>Post a Book</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <CategoryFilter onFilterChange={setFilters} />
        </div>

        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book, idx) => (
            <BookCard key={idx} book={book} success={success} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketPlace
