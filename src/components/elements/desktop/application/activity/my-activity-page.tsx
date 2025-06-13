"use client"
import { Spinner } from '@/components/elements/common/spinner/spinner';
import { BookActivityQueryType } from '@/lib/actions/books/get/get-user-book-acitvity';
import { useGetUserBookRequestActivity } from '@/lib/hooks/tanstack-query/query-hook/book/use-get-book-activity-from-query';
import { useGetUserFromSession } from '@/lib/hooks/tanstack-query/query-hook/user/use-get-user-session';
import { redirect } from 'next/navigation';
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUpdateBookRequestStatus } from "@/lib/hooks/tanstack-query/mutate-hook/books/use-update-book-request-status"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { ActivityType as Activity } from '@/lib/types/books';
import { useCancelBookRequest } from '@/lib/hooks/tanstack-query/mutate-hook/books/use-cancel-book-request';
import { User } from "lucide-react"


const ActivityCard = ({ activity, currentUserId }: { activity: Activity, currentUserId: string }) => { 
    const {mutate : cancel_request, isPending: canceling} = useCancelBookRequest();
    const { mutate: updateRequestStatus, isPending: isUpdating } = useUpdateBookRequestStatus();
    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const handleRequestAction = (status: 'accepted' | 'rejected') => {
        if(isUpdating) return;
        
        if (status === 'accepted') {
            setIsAccepting(true);
        } else {
            setIsRejecting(true);
        }

        updateRequestStatus({
            requestId: activity.bookId,
            userId: activity.customerId,
            status
        }, {
            onSuccess: () => {
                toast.success(`Request ${status} successfully`);
            },
            onError: () => {
                toast.error(`Failed to ${status} request`);
            },
            onSettled: () => {
                setIsAccepting(false);
                setIsRejecting(false);
            }
        });
    }

    const handleCancelRequest = () => {
        if(canceling) return;
        cancel_request({
            bookId: activity.bookId
        }, {
            onSuccess: (res) => {
                if (res.message && res.success) {
                    toast.success('Booking cancelled successfully');
                } else if (res.error && !res.success) {
                    toast.error(res.error || "Something went wrong");
                }
            },
            onError: () => {
                toast.error("Something went wrong");
            }
        }); 
    }

    const isBookOwner = activity.bookOwnerId === currentUserId;
    const isCustomer = activity.customerId === currentUserId;

    return (
        <Card className="w-full h-[300px] flex flex-col overflow-hidden transition-shadow duration-200 ease-in-out hover:shadow-xl border-[#1E3A8A] relative group">
            <div className="flex flex-col flex-grow h-full">
                <div className="p-3 flex-grow flex flex-col">
                    <div className="flex justify-between items-start gap-1 mb-1 relative">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate text-[#1E3A8A]" title={activity.bookTitle}>
                                {activity.bookTitle}
                            </h3>
                            <p className="text-[#4B5563] text-xs truncate" title={activity.bookAuthor}>
                                by {activity.bookAuthor}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                activity.requestStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                                activity.requestStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {activity.requestStatus}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap bg-blue-100 text-blue-800">
                                {activity.bookStatus}
                            </span>
                        </div>
                    </div>

                    <div className="mt-1 mb-2 flex gap-2">
                        <Badge variant="secondary" className="text-[0.65rem] py-0.5 px-1.5 bg-[#F9FAFB] text-[#4B5563] border-[#1E3A8A]">
                            Rs. {activity.bookPrice}
                        </Badge>
                        {isBookOwner && (
                            <Badge variant="secondary" className="text-[0.65rem] py-0.5 px-1.5 bg-[#F9FAFB] text-[#4B5563] border-[#1E3A8A]">
                                Requested by: {activity.customerName}
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#4B5563] mb-2">
                        <User className="h-3 w-3 text-[#0D9488]" />
                        <span>Posted by: {activity.bookOwnerName} {isBookOwner && "(you)"}</span>
                    </div>

                    <p className="mt-auto text-xs line-clamp-2 text-[#4B5563] flex-grow-0 leading-tight">
                        {activity.bookDescription}
                    </p>
                </div>

                <div className="pt-1 px-3 pb-2 text-[0.65rem] text-[#4B5563] border-t border-[#1E3A8A]">
                    <div className="flex justify-between w-full font-bold">
                        <span className="whitespace-nowrap">
                            {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                        {isBookOwner && (
                            <span className="text-[#0D9488]">
                                {activity.customerEmail} • {activity.customerPhoneNumber}
                            </span>
                        )}
                    </div>
                </div>

                {activity.requestStatus === 'pending' && (
                    <div className="p-3 pt-0 flex gap-2">
                        {isBookOwner ? (
                            <>
                                <Button
                                    onClick={() => handleRequestAction('accepted')}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs h-7"
                                    disabled={isUpdating || isAccepting || isRejecting}
                                >
                                    {isAccepting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3">
                                                <Spinner />
                                            </div>
                                            <span>Accepting...</span>
                                        </div>
                                    ) : (
                                        'Accept'
                                    )}
                                </Button>
                                <Button
                                    onClick={() => handleRequestAction('rejected')}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs h-7"
                                    disabled={isUpdating || isAccepting || isRejecting}
                                >
                                    {isRejecting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3">
                                                <Spinner />
                                            </div>
                                            <span>Rejecting...</span>
                                        </div>
                                    ) : (
                                        'Reject'
                                    )}
                                </Button>
                            </>
                        ) : isCustomer ? (
                            <Button
                                onClick={handleCancelRequest}
                                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs h-7"
                                disabled={canceling}
                            >
                                {canceling ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3">
                                            <Spinner />
                                        </div>
                                        <span>Canceling...</span>
                                    </div>
                                ) : (
                                    'Cancel Request'
                                )}
                            </Button>
                        ) : null}
                    </div>
                )}

                {activity.requestStatus !== 'pending' && (
                    <div className="p-3 pt-0 text-xs">
                        {activity.requestStatus === 'accepted' ? (
                            <div className="text-green-600 font-medium">
                                This request has been accepted
                            </div>
                        ) : activity.requestStatus === 'rejected' ? (
                            <div className="text-red-600 font-medium">
                                {isCustomer ? 'Your request was rejected' : 'You rejected this request'}
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </Card>
    )
}

const SearchAndFilter = ({ 
  searchInput, 
  setSearchInput, 
  isLoading, 
  isFetching 
}: { 
  searchInput: string, 
  setSearchInput: (value: string) => void,
  isLoading: boolean,
  isFetching: boolean
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isLoading && !isFetching && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isLoading, isFetching])

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0D9488] h-4 w-4" />
      <Input
        ref={searchInputRef}
        placeholder="Search activities..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="pl-10 border-[#1E3A8A] focus:border-[#0D9488] focus:ring-[#0D9488]"
        disabled={isLoading || isFetching}
      />
    </div>
  )
}

const ActivityPagination = ({
  currentPage,
  totalPages,
  totalBooks,
  isLoading,
  isFetching,
  onPageChange
}: {
  currentPage: number,
  totalPages: number,
  totalBooks: number,
  isLoading: boolean,
  isFetching: boolean,
  onPageChange: (page: number) => void
}) => {
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
  )
}

function MyActivityPage() {
    const itemsPerPage = 30;
    const { data: currentUser, isLoading : userLoading } = useGetUserFromSession();
    const [query, setQuery] = useState<BookActivityQueryType>({
        page: 1,
        limit: itemsPerPage,
        search: "",
        field: "all"
    });
    const [searchInput, setSearchInput] = useState("");
    
    const { data: bookRequests, isLoading: bookRequestLoading,  isFetching } = useGetUserBookRequestActivity(query);
    const [activeFilter, setActiveFilter] = useState<'all' | 'accepted' | 'rejected'>('all');
    const [requestFilter, setRequestFilter] = useState<'your-requests' | 'customer-requests'>('your-requests');

    // Parse and categorize the book requests
    const { parsedRequests, counts } = useMemo(() => {
        if (!bookRequests?.bookRequest) {
            return {
                parsedRequests: [],
                counts: {
                    all: 0,
                    sold: 0,
                    bought: 0,
                    requests: 0,
                    yourRequests: 0,
                    customerRequests: 0,
                    acceptedSold: 0,
                    rejectedSold: 0,
                    acceptedBought: 0,
                    rejectedBought: 0
                }
            };
        }

        const requests = bookRequests.bookRequest as Activity[];
        const currentUserId = currentUser?.userId || '';

        // Categorize all requests
        const allRequests = requests;
        const soldRequests = requests.filter(req => req.bookOwnerId === currentUserId && req.requestStatus !== 'pending');
        const boughtRequests = requests.filter(req => req.customerId === currentUserId && req.requestStatus !== 'pending');
        const pendingRequests = requests.filter(req => req.requestStatus === 'pending');
        
        // Further categorize pending requests
        const yourRequests = pendingRequests.filter(req => req.customerId === currentUserId);
        const customerRequests = pendingRequests.filter(req => req.bookOwnerId === currentUserId);

        // Categorize by status
        const acceptedSold = soldRequests.filter(req => req.requestStatus === 'accepted');
        const rejectedSold = soldRequests.filter(req => req.requestStatus === 'rejected');
        const acceptedBought = boughtRequests.filter(req => req.requestStatus === 'accepted');
        const rejectedBought = boughtRequests.filter(req => req.requestStatus === 'rejected');

        // Filter requests based on current view
        let filteredRequests: Activity[] = [];
        switch (query.field) {
            case 'all':
                filteredRequests = allRequests;
                break;
            case 'sold':
                filteredRequests = soldRequests;
                if (activeFilter === 'accepted') {
                    filteredRequests = acceptedSold;
                } else if (activeFilter === 'rejected') {
                    filteredRequests = rejectedSold;
                }
                break;
            case 'bought':
                filteredRequests = boughtRequests;
                if (activeFilter === 'accepted') {
                    filteredRequests = acceptedBought;
                } else if (activeFilter === 'rejected') {
                    filteredRequests = rejectedBought;
                }
                break;
            case 'requests':
                filteredRequests = requestFilter === 'your-requests' ? yourRequests : customerRequests;
                break;
        }

        return {
            parsedRequests: filteredRequests,
            counts: {
                all: bookRequests?.counts?.all || 0,
                sold: bookRequests?.counts?.sold || 0,
                bought: bookRequests?.counts?.bought || 0,
                requests: bookRequests?.counts?.requests || 0,
                yourRequests: yourRequests.length,
                customerRequests: customerRequests.length,
                acceptedSold: acceptedSold.length,
                rejectedSold: rejectedSold.length,
                acceptedBought: acceptedBought.length,
                rejectedBought: rejectedBought.length
            }
        };
    }, [bookRequests, currentUser?.userId, query.field, activeFilter, requestFilter]);

    const totalPages = bookRequests?.totalPages || 1;
    const currentPage = query.page;
    const totalBooks = bookRequests?.totalBooks || 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            setQuery(prev => ({
                ...prev,
                search: searchInput.trim(),
                page: 1
            }));
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || bookRequestLoading || isFetching) return;
        setQuery(prev => ({
            ...prev,
            page,
        }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleTabChange = (value: string) => {
        setActiveFilter('all'); // Reset filter when changing tabs
        setQuery(prev => ({
            ...prev,
            field: value as BookActivityQueryType['field'],
            page: 1
        }));
    };
    if(userLoading){
        return <Spinner />
    }

    if(!currentUser || !currentUser.userId) {
        redirect("/login")
        return null;
    }

    
    return (
        <div className="min-h-screen w-full bg-[#F9FAFB]">
            <div className="py-3 px-4 h-full">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#1E3A8A]/10">
                            <h1 className="text-2xl font-bold text-[#1E3A8A] mb-2">Activity History</h1>
                            <p className="text-[#4B5563] text-sm">Track your book transactions and requests</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#1E3A8A]/10">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <Tabs 
                                    value={query.field}
                                    onValueChange={handleTabChange}
                                    className="w-full sm:w-auto"
                                >
                                    <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                                        <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                                        <TabsTrigger value="requests">Requests ({counts.requests})</TabsTrigger>
                                        <TabsTrigger value="sold">Sold ({counts.sold})</TabsTrigger>
                                        <TabsTrigger value="bought">Bought ({counts.bought})</TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                <SearchAndFilter 
                                    searchInput={searchInput}
                                    setSearchInput={setSearchInput}
                                    isLoading={bookRequestLoading}
                                    isFetching={isFetching}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-[#1E3A8A]/10">
                        <div className="p-6 h-[calc(100vh-265px)] flex flex-col">
                            <div className="mb-4 flex-shrink-0 flex items-center justify-between gap-4">
                                <div>
                                    {bookRequestLoading || isFetching ? (
                                        <Skeleton className="h-5 w-48 rounded bg-[#F9FAFB]" />
                                    ) : (
                                        <p className="text-sm text-[#4B5563] font-medium">
                                            Showing {parsedRequests.length > 0 ? Math.min((currentPage - 1) * itemsPerPage + 1, totalBooks) : 0} -{" "}
                                            {Math.min(currentPage * itemsPerPage, totalBooks)} of {totalBooks} activity{totalBooks !== 1 ? "ies" : ""}
                                        </p>
                                    )}
                                </div>

                                {query.field === 'requests' && (
                                    <Tabs 
                                        value={requestFilter}
                                        onValueChange={(value) => setRequestFilter(value as 'your-requests' | 'customer-requests')}
                                        className="w-auto"
                                    >
                                        <TabsList className="grid grid-cols-2 w-[300px]">
                                            <TabsTrigger value="your-requests">Your Requests ({counts.yourRequests})</TabsTrigger>
                                            <TabsTrigger value="customer-requests">Customer Requests ({counts.customerRequests})</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                )}

                                {(query.field === 'sold' || query.field === 'bought') && (
                                    <Tabs 
                                        value={activeFilter}
                                        onValueChange={(value) => setActiveFilter(value as 'all' | 'accepted' | 'rejected')}
                                        className="w-auto"
                                    >
                                        <TabsList className="grid grid-cols-3 w-[300px]">
                                            <TabsTrigger value="all">All ({query.field === 'sold' ? counts.sold : counts.bought})</TabsTrigger>
                                            <TabsTrigger value="accepted">Accepted ({query.field === 'sold' ? counts.acceptedSold : counts.acceptedBought})</TabsTrigger>
                                            <TabsTrigger value="rejected">Rejected ({query.field === 'sold' ? counts.rejectedSold : counts.rejectedBought})</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
                                    {bookRequestLoading || isFetching ? (
                                        Array.from({ length: 8 }).map((_, i) => (
                                            <div key={i} className="w-full">
                                                <Skeleton className="w-full h-[300px] rounded-lg" />
                                            </div>
                                        ))
                                    ) : parsedRequests.length > 0 ? (
                                        parsedRequests.map((activity: Activity) => (
                                            <ActivityCard 
                                                key={activity._id} 
                                                activity={activity} 
                                                currentUserId={currentUser.userId}
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-16 h-full flex items-center justify-center">
                                            <div>
                                                <div className="bg-[#F9FAFB] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                                    <Search className="h-10 w-10 text-[#0D9488]" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-[#1E3A8A] mb-3">
                                                    {query.search ? `No activities found matching "${query.search}"` : "No activities found"}
                                                </h3>
                                                <p className="text-[#4B5563] text-lg">
                                                    {query.search ? "Try adjusting your search" : "Your activity history will appear here"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <ActivityPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalBooks={totalBooks}
                        isLoading={bookRequestLoading}
                        isFetching={isFetching}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default MyActivityPage