import Book from '@/components/elements/desktop/site/books/Book'
import { getOneBook } from '@/lib/actions/books/get/getOneBook'
import React from 'react'

type Params = Promise<{ bookId: string }>
const Page = async (props: { params: Params }) => {
    const params = await props.params
    const bookId = params.bookId
    const {success, formattedBook} = await getOneBook({bookId})
    return <Book book={formattedBook as PublicBook} success={success}/>
}

export default Page
