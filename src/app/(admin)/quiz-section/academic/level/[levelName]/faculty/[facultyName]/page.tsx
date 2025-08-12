import { getCurrentUser } from '@/lib/actions/user/get/getCurrentUser';
import { redirect } from 'next/navigation';
import React from 'react'
import YearListpage from '@/components/elements/desktop/application/admin/quiz/year/YearListpage';
async function page() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login")
  }
  if (!currentUser.isAdmin) {
    redirect("/")
  }
  return (
   <YearListpage />
  )
}

export default page
