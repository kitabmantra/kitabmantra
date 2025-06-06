"use client"
import { useGetUserBooks } from "@/lib/hooks/tanstack-query/query-hook/book/use-get-user-books"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useGetUserFromSession } from "@/lib/hooks/tanstack-query/query-hook/user/use-get-user-session"
import { Search, SortAsc } from "lucide-react"
import { redirect } from "next/navigation"
import { useDeleteBookById } from "@/lib/hooks/tanstack-query/mutate-hook/books/use-delete-book-by-id"
import toast from "react-hot-toast"
import { BookCard } from "./BookCard" // Assuming BookCard.tsx exists and is styled
import type { BookForStore } from "@/lib/types/books"
import { Spinner } from "@/components/elements/common/spinner/spinner"
import { Card } from "@/components/ui/card"



export default function MyListingsPage() {
  const itemsPerPage = 6
  const [query, setQuery] = useState({
    page: 1,
    limit: itemsPerPage,
    search: "",
    oldestFirst: false,
  })
  const [searchInput, setSearchInput] = useState("")
  const { data: user, isLoading: userLoading } = useGetUserFromSession()
  const { mutate: deleteBook } = useDeleteBookById()

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
          refetch()
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
      <div className="w-full min-h-screen bg-gray-50 flex justify-center items-center">
        <Spinner />
      </div>
    )
  }

  if (!user || !user.userId) {
    redirect("/login")
    return null
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

  // Generate visible page numbers with window around current page
  const getVisiblePages = () => {
    const visiblePages = [];
    const windowSize = 2; // Number of pages to show on each side of current
    
    let startPage = Math.max(1, currentPage - windowSize);
    let endPage = Math.min(totalPages, currentPage + windowSize);

    // Adjust if we're at the start or end
    if (currentPage <= windowSize + 1) {
      endPage = Math.min(2 * windowSize + 1, totalPages);
    }
    if (currentPage >= totalPages - windowSize) {
      startPage = Math.max(1, totalPages - 2 * windowSize);
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB]">
      <div className="py-3 px-2 h-full">
        <div className="flex rounded-md py-2 px-3 bg-white flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1E3A8A] mb-1">Your Listings</h1>
            <p className="text-[#4B5563] text-sm">Manage and organize your book collection</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D9488] h-4 w-4" />
              <Input
                placeholder="Search by title, author, or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488]"
                disabled={userBooksLoading || isFetching}
                aria-label="Search your book listings"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SortAsc className="text-[#0D9488] h-4 w-4 shrink-0" />
              <Select
                onValueChange={handleSortChange}
                value={query.oldestFirst ? "oldest" : "newest"}
                disabled={userBooksLoading || isFetching}
              >
                <SelectTrigger className="w-full sm:w-[180px] border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md max-h-[740px] md:h-[700px] lg:h-[740px]">
          <div className="p-4 h-full">
            <div className="my-2">
              {userBooksLoading || isFetching ? (
                <Skeleton className="h-5 w-48 rounded bg-[#F9FAFB]" />
              ) : (
                <p className="text-sm mb-2 text-[#4B5563] font-medium">
                  Showing {totalBooks > 0 ? Math.min((currentPage - 1) * itemsPerPage + 1, totalBooks) : 0} -{" "}
                  {Math.min(currentPage * itemsPerPage, totalBooks)} of {totalBooks} book{totalBooks !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div className="relative top-3">
              {userBooksLoading || isFetching ? (
                <div className="grid mt-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 my-2 max-h-[650px] md:h-[630px] lg:h-[650px] overflow-y-auto xl:grid-cols-5 gap-y-5 gap-x-3">
                  {Array.from({ length: itemsPerPage }).map((_, i) => (
                    <Card key={i} className="w-[280px] h-[300px] border-slate-200 overflow-hidden">
                      <div className="h-48 w-full bg-slate-100">
                        <Skeleton className="h-full w-full" />
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <div className="flex gap-1">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-3" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-3" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <div className="px-3 pb-3 pt-1 border-t border-slate-200">
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : userBooks?.books && userBooks.books.length > 0 ? (
                <div className="grid mt-2 grid-cols-1 sm:grid-cols-2 my-2 max-h-[650px] md:h-[630px] lg:h-[650px] overflow-y-auto lg:grid-cols-4 xl:grid-cols-5 gap-y-5 gap-x-3">
                  {userBooks.books.map((book: BookForStore) => (
                    <BookCard key={book._id} book={book} success={userBooks.success} handleDelete={handleDelete} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="bg-[#F9FAFB] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#0D9488]"
                    >
                      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0-.019 1.838l8.57 3.908a2 2 0 0 0 1.66 0z" />
                      <path d="M22 10v6M2.6 9.084l8.57 3.908a2 2 0 0 0 1.66 0l8.57-3.908" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1E3A8A] mb-3">
                    {query.search ? `No books found matching "${query.search}"` : "You haven't listed any books yet."}
                  </h3>
                  <p className="text-[#4B5563] text-lg">
                    {query.search ? "Try adjusting your search or filter." : "List your first book to see it here!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center md:mt-2 lg:mt-4">
          {totalPages > 1 && (
            <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm border-t border-slate-200 py-4">
              <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Page info */}
                  <div className="text-sm text-slate-600">
                    {userBooksLoading || isFetching ? (
                      <Skeleton className="h-4 w-48" />
                    ) : (
                      `Page ${currentPage} of ${totalPages} • ${totalBooks} items total`
                    )}
                  </div>
                  
                  {/* Pagination controls */}
                  <Pagination className="mx-0">
                    <PaginationContent>
                      <PaginationItem>
                        <div className={isFirstPage || userBooksLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
                          <PaginationPrevious
                            className="w-24 border border-slate-200 hover:bg-slate-100"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!isFirstPage && !userBooksLoading && !isFetching) {
                                handlePageChange(currentPage - 1);
                              }
                            }}
                          >
                            Previous
                          </PaginationPrevious>
                        </div>
                      </PaginationItem>

                      {/* First page */}
                      {currentPage > 3 && totalPages > 5 && (
                        <PaginationItem>
                          <PaginationLink
                            className="border border-slate-200 hover:bg-slate-100"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!userBooksLoading && !isFetching) {
                                handlePageChange(1);
                              }
                            }}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Ellipsis if needed */}
                      {currentPage > 4 && totalPages > 5 && (
                        <PaginationItem>
                          <span className="px-3 py-2">...</span>
                        </PaginationItem>
                      )}

                      {/* Dynamic page numbers */}
                      {getVisiblePages().map((pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            className={`border ${
                              currentPage === pageNum 
                                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                                : 'border-slate-200 hover:bg-slate-100'
                            }`}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!userBooksLoading && !isFetching) {
                                handlePageChange(pageNum);
                              }
                            }}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {/* Ellipsis if needed */}
                      {currentPage < totalPages - 3 && totalPages > 5 && (
                        <PaginationItem>
                          <span className="px-3 py-2">...</span>
                        </PaginationItem>
                      )}

                      {/* Last page */}
                      {currentPage < totalPages - 2 && totalPages > 5 && (
                        <PaginationItem>
                          <PaginationLink
                            className="border border-slate-200 hover:bg-slate-100"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!userBooksLoading && !isFetching) {
                                handlePageChange(totalPages);
                              }
                            }}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <div className={isLastPage || userBooksLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
                          <PaginationNext
                            className="w-24 border border-slate-200 hover:bg-slate-100"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!isLastPage && !userBooksLoading && !isFetching) {
                                handlePageChange(currentPage + 1);
                              }
                            }}
                          >
                            Next
                          </PaginationNext>
                        </div>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
