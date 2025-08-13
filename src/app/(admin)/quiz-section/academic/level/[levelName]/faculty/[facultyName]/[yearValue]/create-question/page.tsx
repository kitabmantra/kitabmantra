import CreateQuestionMainPage from '@/components/elements/desktop/application/admin/quiz/year/create-question.tsx/create-quesiton-main-page'
import { getCurrentUser } from '@/lib/actions/user/get/getCurrentUser'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Page() {
  const user = await getCurrentUser()

  if (!user) redirect("/login")
  if (!user.isAdmin) redirect("/")

  return <CreateQuestionMainPage />
} 