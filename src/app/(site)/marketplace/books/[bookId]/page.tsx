import Book from '@/components/elements/desktop/site/books/Book'
import { getAllBooks } from '@/lib/actions/books/get/getAllBooks'
import { getOneBook } from '@/lib/actions/books/get/getOneBook'
import { getOneBookForId } from '@/lib/actions/books/get/getOneBookForId'
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
    const { formattedBook: bookString } = await getOneBook({ bookId: params.bookId })
    const formattedBook = JSON.parse(bookString as string)

    return {
        title: formattedBook?.title || 'Book Not Found',
        description: formattedBook?.description || 'No description available',
        openGraph: {
            title: formattedBook?.title || 'Book Not Found',
            description: formattedBook?.description || 'No description available',
            images: [
                {
                    url: formattedBook?.coverImage || "./opengraph-image.png",
                }
            ]
        }
    }
}

const Page = async (props: { params: Params }) => {
    const params = await props.params
    const { success, formattedBook } = await getOneBookForId({ bookId: params.bookId })
    
    
    return <Book book={formattedBook} success={success} />
}

export default Page