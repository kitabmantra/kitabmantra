import { getCurrentUser } from '@/lib/actions/user/get/getCurrentUser'
import { redirect } from 'next/navigation';
import React from 'react'
import YearNamePage from '@/components/elements/desktop/application/admin/quiz/year/YearNamePage';
async function page() {
  const currentUser = await getCurrentUser();
  if(!currentUser){
    redirect("/login")
  }
  if(!currentUser.isAdmin){
    redirect("/")
  }
  return (
   <YearNamePage/>
  )
}

export default page
