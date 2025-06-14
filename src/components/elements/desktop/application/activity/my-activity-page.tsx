"use client"
import { Spinner } from '@/components/elements/common/spinner/spinner';
import { BookActivityQueryType } from '@/lib/actions/books/get/get-user-book-acitvity';
import { useGetUserBookRequestActivity } from '@/lib/hooks/tanstack-query/query-hook/book/use-get-book-activity-from-query';
import { useGetUserFromSession } from '@/lib/hooks/tanstack-query/query-hook/user/use-get-user-session';
import { redirect } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"
import { ActivityType as Activity } from '@/lib/types/books';
import { ActivityCard } from './ActivityCard';
import { SearchAndFilter } from './SearchAndFilter';
import { ActivityPagination } from './ActivityPagination';

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
    
    const { data: bookRequests, isLoading: bookRequestLoading, isFetching } = useGetUserBookRequestActivity(query);
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

        const allRequests = requests;
        const soldRequests = requests.filter(req => req.bookOwnerId === currentUserId && req.requestStatus !== 'pending');
        const boughtRequests = requests.filter(req => req.customerId === currentUserId && req.requestStatus !== 'pending');
        const pendingRequests = requests.filter(req => req.requestStatus === 'pending');
        
        const yourRequests = pendingRequests.filter(req => req.customerId === currentUserId);
        const customerRequests = pendingRequests.filter(req => req.bookOwnerId === currentUserId);

        const acceptedSold = soldRequests.filter(req => req.requestStatus === 'accepted');
        const rejectedSold = soldRequests.filter(req => req.requestStatus === 'rejected');
        const acceptedBought = boughtRequests.filter(req => req.requestStatus === 'accepted');
        const rejectedBought = boughtRequests.filter(req => req.requestStatus === 'rejected');

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
        setActiveFilter('all'); 
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