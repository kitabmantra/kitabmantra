"use client"
import { useGetUserBooks } from "@/lib/hooks/tanstack-query/query-hook/book/use-get-user-books"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useGetUserFromSession } from "@/lib/hooks/tanstack-query/query-hook/user/use-get-user-session"
// Assuming Spinner is a custom component. If not, replace with a suitable loader.
// import { Spinner } from '@/components/elements/common/spinner/spinner';
import { Loader2 } from "lucide-react" // Using Lucide spinner as a placeholder
import { redirect } from "next/navigation"
import { useDeleteBookById } from "@/lib/hooks/tanstack-query/mutate-hook/books/use-delete-book-by-id"
import toast from "react-hot-toast"
import { BookCard } from "./BookCard"

// Placeholder Spinner component if not available
const Spinner = () => (
  <div className="flex justify-center items-center">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
)

export default function MyListingsPage() {
  const itemsPerPage = 4
  const [query, setQuery] = useState({
    page: 1,
    limit: itemsPerPage,
    search: "",
    oldestFirst: false,
  })
  const [searchInput, setSearchInput] = useState("")
  const { data: user, isLoading: userLoading } = useGetUserFromSession()
  const { mutate: deleteBook } = useDeleteBookById() // isPending: deletingBook is not used in current logic

  const {
    data: userBooks,
    isLoading: userBooksLoading,
    isFetching,
    refetch,
  } = useGetUserBooks({
    page: query.page,
    limit: query.limit,
    search: query.search,
    oldestFirst: query.oldestFirst,
  })

  const totalPages = userBooks?.totalPages || 1
  const currentPage = query.page
  const totalBooks = userBooks?.totalBooks || 0
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages || totalPages === 0

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        search: searchInput,
        page: 1,
      }))
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    refetch()
  }, [query.page, query.search, query.oldestFirst, refetch])

  const handleDelete = (id: string) => {
    deleteBook(id, {
      onSuccess: (res) => {
        if (res.success && res.message) {
          toast.success(res.message)
          refetch();
          // Optionally, refetch books after successful deletion
          // refetch();
          // If the deleted item was the last on a page, or to update counts,
          // you might need to adjust the current page or refetch.
          // For simplicity and adhering to "no logic change", this is omitted.
          // A common pattern is to refetch the current page:
          // if (userBooks?.books.length === 1 && query.page > 1) {
          //   setQuery(prev => ({ ...prev, page: prev.page - 1 }));
          // } else {
          //   refetch();
          // }
        } else if (res.error && !res.success) {
          toast.error(res.error)
        }
      },
      onError: (error) => {
        toast.error("Failed to delete book. Please try again.")
        console.error("Delete error:", error)
      },
    })
  }

  if (userLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    )
  }

  if (!user || !user.userId) {
    redirect("/login")
    return null // Redirect will handle it, but good practice to return null
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || userBooksLoading || isFetching) return

    setQuery((prev) => ({
      ...prev,
      page,
    }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSortChange = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      oldestFirst: value === "oldest",
      page: 1,
    }))
  }

  const getPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5
    let startPage = 1
    let endPage = Math.min(totalPages, maxVisiblePages)

    if (totalPages > maxVisiblePages) {
      const half = Math.floor(maxVisiblePages / 2)
      startPage = Math.max(1, currentPage - half)
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }
    }

    items.push(
      <PaginationItem key="prev">
        <div className={isFirstPage || userBooksLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (!isFirstPage && !userBooksLoading && !isFetching) {
                handlePageChange(currentPage - 1)
              }
            }}
            aria-disabled={isFirstPage || userBooksLoading || isFetching}
          />
        </div>
      </PaginationItem>,
    )

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <div className={userBooksLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (!userBooksLoading && !isFetching) handlePageChange(1)
              }}
              isActive={1 === currentPage}
              aria-current={1 === currentPage ? "page" : undefined}
            >
              1
            </PaginationLink>
          </div>
        </PaginationItem>,
      )
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <div className={userBooksLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (!userBooksLoading && !isFetching) handlePageChange(i)
              }}
              isActive={i === currentPage}
              aria-current={i === currentPage ? "page" : undefined}
            >
              {i}
            </PaginationLink>
          </div>
        </PaginationItem>,
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }
      items.push(
        <PaginationItem key={totalPages}>
          <div className={userBooksLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (!userBooksLoading && !isFetching) handlePageChange(totalPages)
              }}
              isActive={totalPages === currentPage}
              aria-current={totalPages === currentPage ? "page" : undefined}
            >
              {totalPages}
            </PaginationLink>
          </div>
        </PaginationItem>,
      )
    }

    items.push(
      <PaginationItem key="next">
        <div className={isLastPage || userBooksLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (!isLastPage && !userBooksLoading && !isFetching) {
                handlePageChange(currentPage + 1)
              }
            }}
            aria-disabled={isLastPage || userBooksLoading || isFetching}
          />
        </div>
      </PaginationItem>,
    )
    return items
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Your Listings
        </h1>
      </header>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
          <Input
            placeholder="Search by title, author, or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full md:flex-grow"
            disabled={userBooksLoading || isFetching}
            aria-label="Search your book listings"
          />
          <Select
            onValueChange={handleSortChange}
            value={query.oldestFirst ? "oldest" : "newest"}
            disabled={userBooksLoading || isFetching}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-h-[40px]">
          {" "}
          {userBooksLoading || isFetching ? (
            <Skeleton className="h-6 w-48 rounded" />
          ) : (
            <p className="text-sm text-muted-foreground">
              Showing {totalBooks > 0 ? Math.min((currentPage - 1) * itemsPerPage + 1, totalBooks) : 0} -{" "}
              {Math.min(currentPage * itemsPerPage, totalBooks)} of {totalBooks} book{totalBooks !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="max-h-[600px] overflow-y-auto pr-2">
          {" "}
          {/* Added pr-2 for scrollbar space */}
          {userBooksLoading || isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <Skeleton key={i} className="h-[420px] w-full rounded-lg" />
              ))}
            </div>
          ) : userBooks?.books && userBooks.books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userBooks.books.map(
                (
                  book: BookForStore, // Use PublicBook type
                ) => (
                  <BookCard
                    key={book._id}
                    book={book}
                    success={userBooks.success} // Propagating success as per original logic
                    handleDelete={handleDelete}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
              >
                <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0-.019 1.838l8.57 3.908a2 2 0 0 0 1.66 0z" />
                <path d="M22 10v6M2.6 9.084l8.57 3.908a2 2 0 0 0 1.66 0l8.57-3.908" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {query.search ? `No books found matching "${query.search}"` : "You haven't listed any books yet."}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {query.search ? "Try adjusting your search or filter." : "List your first book to see it here!"}
              </p>
            </div>
          )}
        </div>

        {!(userBooksLoading || isFetching) && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>{getPaginationItems()}</PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
