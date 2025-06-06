import BookMainPage from '@/components/elements/desktop/site/books/book-main'
import React, { Suspense } from 'react'

function page() {
  return (
    <Suspense>
      <div className='min-h-screen bg-[#F9FAFB]'>
        <BookMainPage />
      </div>
    </Suspense>
  )
}

export default page
