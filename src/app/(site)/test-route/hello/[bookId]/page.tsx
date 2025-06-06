import Book from '@/components/elements/desktop/site/books/Book'
import { getAllBooks } from '@/lib/actions/books/get/getAllBooks'
import { getOneBook } from '@/lib/actions/books/get/getOneBook'
import { Metadata } from 'next'
import React from 'react'
type Params = Promise<{ bookId: string }>

export const revalidate = 60;

export async function generateStaticParams() {
    const { formattedBooks } = await getAllBooks()
    
    return (
        formattedBooks
            ?.map(({ bookId }) => ({ bookId }))
            .slice(0, 100)
        ?? []
    );
}

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
    const params = await props.params
    const bookId = params.bookId
    const { formattedBook:bookString } = await getOneBook({ bookId })
    const formattedBook = JSON.parse(bookString as string);

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

const Page = async (props: { params: Params }) => {
    const params = await props.params
    const bookId = params.bookId
    const { success, formattedBook } = await getOneBook({ bookId })
    return <Book book={formattedBook} success={success} />
}

export default Page
