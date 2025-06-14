"use client"
import { Spinner } from '@/components/elements/common/spinner/spinner';
import { ActivityType as Activity } from '@/lib/types/books';
import { useCancelBookRequest } from '@/lib/hooks/tanstack-query/mutate-hook/books/use-cancel-book-request';
import { useUpdateBookRequestStatus } from "@/lib/hooks/tanstack-query/mutate-hook/books/use-update-book-request-status";
import { User } from "lucide-react";
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ActivityCardProps {
    activity: Activity;
    currentUserId: string;
}

export const ActivityCard = ({ activity, currentUserId }: ActivityCardProps) => { 
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
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-[#4B5563] mb-2">
                        <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-[#0D9488]" />
                            <span>Posted by: {activity.bookOwnerName} {isBookOwner && "(you)"}</span>
                        </div>
                        {isBookOwner && (
                            <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-[#0D9488]" />
                                <span>Requested by: {activity.customerName}</span>
                            </div>
                        )}
                    </div>

                    <p className="mt-auto text-xs line-clamp-2 text-[#4B5563] flex-grow-0 leading-tight">
                        {activity.bookDescription}
                    </p>
                </div>

                <div className="pt-1 px-3 pb-2 text-[0.65rem] text-[#4B5563] border-t border-[#1E3A8A]">
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between w-full font-bold">
                            <span className="whitespace-nowrap">
                                {new Date(activity.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        {activity.requestStatus === 'accepted' && (
                            <>
                                {isBookOwner && (
                                    <div className="text-[#0D9488]">
                                        <div>Customer Contact:</div>
                                        <div>{activity.customerEmail}</div>
                                        <div>{activity.customerPhoneNumber}</div>
                                    </div>
                                )}
                                {isCustomer && (
                                    <div className="text-[#0D9488]">
                                        <div>Book Owner Contact:</div>
                                        <div>{activity.bookOwnerEmail}</div>
                                        <div>{activity.bookOwnerPhoneNumber}</div>
                                    </div>
                                )}
                            </>
                        )}
                        {(activity.requestStatus === 'pending' || activity.requestStatus === 'rejected') && (
                            <div className="text-[#0D9488]">
                                {isBookOwner ? (
                                    <div>Requested by: {activity.customerName}</div>
                                ) : (
                                    <div>Posted by: {activity.bookOwnerName}</div>
                                )}
                            </div>
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