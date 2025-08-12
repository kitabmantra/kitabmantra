import LevelNamePage from '@/components/elements/desktop/application/admin/quiz/academic/level/LevelNamePage'
import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/user/get/getCurrentUser';
async function page() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
     redirect("/login")
  }
  if (!currentUser.isAdmin) {
    redirect("/")
  }

  return (
    <LevelNamePage />
  )

}

export default page
