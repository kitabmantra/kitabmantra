import AcademicPage from '@/components/elements/desktop/application/admin/quiz/academic/AcademicPage'
import { getCurrentUser } from '@/lib/actions/user/get/getCurrentUser';
import { redirect } from 'next/navigation';
import React from 'react'

async function page() {
  const user = await getCurrentUser();
  if(!user) redirect("/login");
  if(!user.isAdmin) redirect("/");
  return (
    <AcademicPage />
  )
}

export default page
