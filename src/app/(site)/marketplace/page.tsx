import MarketPlace from '@/components/elements/desktop/site/MarketPlace'
import { getAllBooks } from '@/lib/actions/books/get/getAllBooks'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
    title: "Buy, Sell or Exchange Books for free"
}

const Page = async () => {
    const response = await getAllBooks()
    const books = response.success ? response.formattedBooks as PublicBook[] : []
    return <MarketPlace success={response.success} allBooks={books} />
}

export default Page
