import QuizPage from '@/components/elements/desktop/application/quiz/QuizPage';
import { getCurrentUser } from '@/lib/actions/user/get/getCurrentUser'
import { redirect } from 'next/navigation';
import React from 'react'

async function page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div>
      <QuizPage user={user}/>    
    </div>
  )
}

export default page
