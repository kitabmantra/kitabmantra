"use client"
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';

interface MyListingsProps {
    success: boolean;
    listedBooks: Book[]
}

const MyListings = ({
    success,
    listedBooks,
}: MyListingsProps) => {
    useEffect(() => {
        if (!success) {
            toast.error('Something went wrong.')
        }
    }, [success])
    return (
        <div>
            {
                listedBooks && listedBooks.length > 0 ? (
                    listedBooks.map(lBook => (
                        <div key={lBook.bookId}>
                            {lBook.bookId}
                            <br />
                            {JSON.parse(lBook.location)}
                        </div>
                    ))
                ) : (
                    <div>
                        No books found. Try adding few.
                    </div>
                )
            }
        </div>
    )
}

export default MyListings
