'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetBooks } from '@/lib/hooks/tanstack-query/query-hook/book/use-get-books';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { BookCard } from './book-card';
import { BookFiltersDesktop } from './bookfilterdesktop';
import { BookForStore } from '@/lib/types/books';
import { Card } from '@/components/ui/card';

function BookMainPage() {
  const searchParams = useSearchParams();
  const itemPerPage = 30;

  const [params, setParams] = useState({
    search: searchParams.get("search") || "",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 10000,
    condition: searchParams.get("condition") || "",
    type: searchParams.get("type") || "",
    level: searchParams.get("level") || "",
    faculty: searchParams.get("faculty") || "",
    year: searchParams.get("year") || "",
    class: searchParams.get("class") || "",
    location: searchParams.get("location") || "",
    page: 1,
    limit: itemPerPage,
  });

  const {
    data,
    isLoading: dataLoading,
    isError,
    isFetching,
  } = useGetBooks(params);

  const totalPages = data?.totalPages || 1;
  const currentPage = params.page;
  const totalBooks = data?.totalBooks || 0;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  useEffect(() => {
    setParams({
      search: searchParams.get("search") || "",
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 10000,
      condition: searchParams.get("condition") || "",
      type: searchParams.get("type") || "",
      level: searchParams.get("level") || "",
      faculty: searchParams.get("faculty") || "",
      year: searchParams.get("year") || "",
      class: searchParams.get("class") || "",
      location: searchParams.get("location") || "",
      page: 1,
      limit: itemPerPage,
    });
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || dataLoading || isFetching) return;
    setParams(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setParams({
      search: "",
      minPrice: 0,
      maxPrice: 10000,
      condition: "",
      type: "",
      level: "",
      faculty: "",
      year: "",
      class: "",
      location: "",
      page: 1,
      limit: itemPerPage,
    });
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
    <div className='flex flex-col md:flex-row gap-6 p-4 pt-24 min-h-screen'>
      <div className="w-full md:w-80 md:sticky top-24 md:self-start">
        <BookFiltersDesktop handleReset={handleReset} />
      </div>

      <div className="flex-1 flex flex-col min-h-[calc(100vh-2rem)]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] bg-clip-text text-transparent">
            Discover Your Next Read
          </h1>
          <p className="text-lg text-slate-600 mt-3 max-w-2xl">
            Browse through our collection of academic books, find the perfect match for your studies, and connect with fellow students
          </p>
        </div>

        <div className="mb-6">
          {dataLoading || isFetching ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            <p className="text-sm font-medium text-slate-600">
              Showing {(currentPage - 1) * itemPerPage + 1} -{' '}
              {Math.min(currentPage * itemPerPage, totalBooks)} of{' '}
              {totalBooks} books
            </p>
          )}
        </div>

        <div className="flex-1">
          {(dataLoading || isFetching) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4">
              {Array.from({ length: itemPerPage }).map((_, i) => (
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
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-red-500">Failed to load books. Please try again.</p>
            </div>
          ) : (
            <>
              {data?.books && data.books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-4">
                  {data.books.map((book: BookForStore) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-600">No books found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 py-4 mt-6">
            <div className="container mx-auto px-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page info */}
                <div className="text-sm text-slate-600">
                  {dataLoading || isFetching ? (
                    <Skeleton className="h-4 w-48" />
                  ) : (
                    `Page ${currentPage} of ${totalPages} • ${totalBooks} items total`
                  )}
                </div>
                
                {/* Pagination controls */}
                <Pagination className="mx-0">
                  <PaginationContent>
                    <PaginationItem>
                      <div className={isFirstPage || dataLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
                        <PaginationPrevious
                          className="w-24 border border-slate-200 hover:bg-slate-100"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
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
                            handlePageChange(1);
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
                            handlePageChange(pageNum);
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
                            handlePageChange(totalPages);
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <div className={isLastPage || dataLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
                        <PaginationNext
                          className="w-24 border border-slate-200 hover:bg-slate-100"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
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
  );
}

export default BookMainPage;