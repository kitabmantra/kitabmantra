import MyListings from '@/components/elements/desktop/application/my-listings/MyListings'
import { getBooksByUser } from '@/lib/actions/books/get/getBooksByUser'
import { getCurrentUser } from '@/lib/actions/user/get/getCurrentUser'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async () => {
    const user = await getCurrentUser()
    if (!user) redirect("/login")
    const response = await getBooksByUser()
    const listedBooks = response.formattedBooks as Book[]
    return (
        <MyListings success={response.success} listedBooks={listedBooks} />
    )
}
export default Page
