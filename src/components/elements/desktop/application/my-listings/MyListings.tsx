"use client"
import { useGetUserBooks } from "@/lib/hooks/tanstack-query/query-hook/book/use-get-user-books"
import { useState, useEffect, useRef } from "react"
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
  const itemsPerPage = 30
  const searchInputRef = useRef<HTMLInputElement>(null)
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
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Add new effect to maintain focus after data fetching
  useEffect(() => {
    if (!userBooksLoading && !isFetching && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [userBooksLoading, isFetching])

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
  console.log('this is user books : ',userBooks)

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
      <div className="py-3 px-4 h-full">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-[#1E3A8A]/10">
              <h1 className="text-2xl font-bold text-[#1E3A8A] mb-2">Your Listings</h1>
              <p className="text-[#4B5563] text-sm">Manage and organize your book collection</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-[#1E3A8A]/10">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D9488] h-4 w-4" />
                  <Input
                    ref={searchInputRef}
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
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#1E3A8A]/10">
            <div className="p-6 h-[calc(100vh-265px)] flex flex-col">
              <div className="mb-4 flex-shrink-0">
                {userBooksLoading || isFetching ? (
                  <Skeleton className="h-5 w-48 rounded bg-[#F9FAFB]" />
                ) : (
                  <p className="text-sm text-[#4B5563] font-medium">
                    Showing {totalBooks > 0 ? Math.min((currentPage - 1) * itemsPerPage + 1, totalBooks) : 0} -{" "}
                    {Math.min(currentPage * itemsPerPage, totalBooks)} of {totalBooks} book{totalBooks !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {userBooksLoading || isFetching ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Card key={i} className="w-full h-[300px] border-slate-200 overflow-hidden">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {userBooks.books.map((book: BookForStore) => (
                      <BookCard key={book._id} book={book} success={userBooks.success} handleDelete={handleDelete} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 h-full flex items-center justify-center">
                    <div>
                      <div className="bg-[#F9FAFB] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <Search className="h-10 w-10 text-[#0D9488]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#1E3A8A] mb-3">
                        {query.search ? `No books found matching "${query.search}"` : "You haven't listed any books yet."}
                      </h3>
                      <p className="text-[#4B5563] text-lg">
                        {query.search ? "Try adjusting your search" : "List your first book to see it here!"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Add custom scrollbar styles */}
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #1E3A8A;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #0D9488;
            }
          `}</style>

          {totalPages > 1 && (
            <div className="w-full max-w-7xl bg-white/90 backdrop-blur-sm border-t border-slate-200 py-4 mt-4 sticky bottom-0">
              <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-slate-600">
                    {userBooksLoading || isFetching ? (
                      <Skeleton className="h-4 w-48" />
                    ) : (
                      `Page ${currentPage} of ${totalPages} • ${totalBooks} items total`
                    )}
                  </div>
                  
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
