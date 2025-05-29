import Book from '@/components/elements/desktop/site/books/Book'
import { getAllBooks } from '@/lib/actions/books/get/getAllBooks'
import { getOneBook } from '@/lib/actions/books/get/getOneBook'
import { Metadata } from 'next'
import React from 'react'

export const revalidate = 10 // ISR: regenerate page every 5 seconds

export async function generateStaticParams() {
    const { formattedBooks } = await getAllBooks()
    return (
        formattedBooks
            ?.map(({ bookId }) => ({ bookId }))
            .slice(0, 100)
        ?? []
    );
}

export async function generateMetadata({ params }: { params: { bookId: string } }): Promise<Metadata> {
    const { bookId } = params
    const { formattedBook } = await getOneBook({ bookId })
    return {
        title: formattedBook?.title,
        description: formattedBook?.description,
        openGraph: {
            images: [
                {
                    url: "./opengraph-image.png",
                }
            ]
        }
    }
}

const Page = async ({ params }: { params: { bookId: string } }) => {
    const { bookId } = params
    const { success, formattedBook } = await getOneBook({ bookId })
    return <Book book={formattedBook as PublicBook} success={success} />
}

export default Page
