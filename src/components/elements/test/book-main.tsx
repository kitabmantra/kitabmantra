'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetBooks } from '@/lib/hooks/tanstack-query/query-hook/book/use-get-books';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { BookCard } from './book-card';
import { BookFiltersDesktop } from './bookfilterdesktop';

function BookMainPage() {
  const searchParams = useSearchParams();
  const itemPerPage = 4;

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
    page: 1, // Reset to page 1 when filters change
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

  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = Math.min(totalPages, maxVisiblePages);

    if (totalPages > maxVisiblePages) {
      const half = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(1, currentPage - half);
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }


    items.push(
      <PaginationItem key="prev">
        <div className={isFirstPage || dataLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
          />
        </div>
      </PaginationItem>
    );


    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <div className={dataLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(1);
              }}
              isActive={1 === currentPage}
            >
              1
            </PaginationLink>
          </div>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <div className={dataLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </div>
        </PaginationItem>
      );
    }

    // Last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <div className={dataLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(totalPages);
              }}
              isActive={totalPages === currentPage}
            >
              {totalPages}
            </PaginationLink>
          </div>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <div className={isLastPage || dataLoading || isFetching ? "pointer-events-none opacity-50" : ""}>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
          />
        </div>
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className='flex flex-col md:flex-row gap-6 p-4'>
      {/* Filters Sidebar */}
      <div className="w-full md:w-80">
        <BookFiltersDesktop  handleReset={handleReset} />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Results Count */}
        <div className="mb-4">
          {dataLoading || isFetching ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemPerPage + 1} -{' '}
              {Math.min(currentPage * itemPerPage, totalBooks)} of{' '}
              {totalBooks} books
            </p>
          )}
        </div>

        {(dataLoading || isFetching) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: itemPerPage }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-red-500">Failed to load books. Please try again.</p>
          </div>
        ) : (
          <>
            {data?.books && data.books.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.books.map((book: BookForStore) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>{getPaginationItems()}</PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <p>No books found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BookMainPage;