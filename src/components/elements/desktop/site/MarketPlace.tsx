"use client"
import toast from 'react-hot-toast'

interface MarketPlaceProps {
    success: boolean,
    allBooks: PublicBook[]
}

const MarketPlace = ({
    success,
    allBooks
}: MarketPlaceProps) => {
    if (!success) toast.error("Something went wrong!")
    return (
        <div className='flex gap-4'>
            {
                allBooks && allBooks.length > 0 ? (
                    allBooks.map(book => (
                        <div key={book.bookId}>
                            {book.title}
                            <br />
                            {book.createdAt}
                            <br />
                            {JSON.parse(book.location).trim() ? book.location : "Not provided"}
                        </div>
                    ))
                ) : (
                    <div>
                        No listed Books found. Be the one to add one.
                    </div>
                )
            }
        </div >
    )
}

export default MarketPlace
