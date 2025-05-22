import MarketPlace from '@/components/elements/desktop/site/MarketPlace'
import { getAllBooks } from '@/lib/actions/books/get/getAllBooks'
import React from 'react'

const Page = async () => {
    const response = await getAllBooks()
    const books = response.success ? response.formattedBooks as PublicBook[] : []
    return <MarketPlace success={response.success} allBooks={books} />
}

export default Page
