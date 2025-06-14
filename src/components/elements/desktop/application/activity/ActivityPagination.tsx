"use client"
import { Skeleton } from "@/components/ui/skeleton";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface ActivityPaginationProps {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    isLoading: boolean;
    isFetching: boolean;
    onPageChange: (page: number) => void;
}

export const ActivityPagination = ({
    currentPage,
    totalPages,
    totalBooks,
    isLoading,
    isFetching,
    onPageChange
}: ActivityPaginationProps) => {
    const getVisiblePages = () => {
        const visiblePages = [];
        const windowSize = 2;
        
        let startPage = Math.max(1, currentPage - windowSize);
        let endPage = Math.min(totalPages, currentPage + windowSize);

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

    if (totalPages <= 1) return null;

    return (
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm border-t border-slate-200 py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                        {isLoading || isFetching ? (
                            <Skeleton className="h-4 w-48" />
                        ) : (
                            `Page ${currentPage} of ${totalPages} • ${totalBooks} items total`
                        )}
                    </div>
                    
                    <Pagination className="mx-0">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    className="w-24 border border-slate-200 hover:bg-slate-100"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1 && !isLoading && !isFetching) {
                                            onPageChange(currentPage - 1);
                                        }
                                    }}
                                    aria-disabled={currentPage === 1 || isLoading || isFetching}
                                >
                                    Previous
                                </PaginationPrevious>
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
                                            if (!isLoading && !isFetching) {
                                                onPageChange(pageNum);
                                            }
                                        }}
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    className="w-24 border border-slate-200 hover:bg-slate-100"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages && !isLoading && !isFetching) {
                                            onPageChange(currentPage + 1);
                                        }
                                    }}
                                    aria-disabled={currentPage === totalPages || isLoading || isFetching}
                                >
                                    Next
                                </PaginationNext>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}; 