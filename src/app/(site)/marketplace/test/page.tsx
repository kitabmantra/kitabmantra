import BookMainPage from '@/components/elements/test/book-main'
import React, { Suspense } from 'react'

function page() {
  return (
    <Suspense>
      <div className=''>
        <BookMainPage />
      </div>
    </Suspense>
  )
}

export default page
