"use client"
import { useBookId } from '@/lib/hooks/params/useBookId'
import { useGetUserBookById } from '@/lib/hooks/tanstack-query/query-hook/book/use-get-user-book-by-id';
import React from 'react'
import { BookEditForm } from './EditBookForm';

function EditPage() {
    const bookId = useBookId();
    const {data : bookData, isLoading : bookDataLoading} = useGetUserBookById(bookId)
    if (bookDataLoading ) return <div>Loading...</div>
    if (!bookData) return <div>Book not found</div>
    
  return (
    <div>
      <BookEditForm initialData={bookData?.book} />
    </div>
  )
}

export default EditPage
