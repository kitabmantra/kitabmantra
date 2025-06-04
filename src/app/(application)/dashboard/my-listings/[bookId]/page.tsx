import Book from '@/components/elements/desktop/application/my-listings/BookPage';
import { getOneUserBook } from '@/lib/actions/books/get/getOneUserBook';
import { Metadata } from 'next';
import React from 'react'


type Params = Promise<{ bookId: string }>


export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
    const params = await props.params
    const bookId = params.bookId
    const { formattedbookData : formattedBook } = await getOneUserBook( bookId )


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
    const { success, formattedbookData } = await getOneUserBook(bookId) 
    return  <Book book={formattedbookData}  success={success} />
}

export default Page