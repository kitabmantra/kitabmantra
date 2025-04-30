
import { getUserFromId } from '@/lib/actions/user/get/get-user-from-id';
import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import OnboardingForm from '@/components/elements/desktop/onboarding/onboarding-form';
const Page = async () => {
  const session = await auth();
  console.log("this is session : ", session)
  if (!session || !session?.user || !session.user?.id) redirect("/login");
  const user = await getUserFromId(session.user.id);
  console.log("this is user from server : ", user)
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen min-w-screen w-full h-full flex justify-center items-center">
      <OnboardingForm sessionData={session}/>
    </div>

  )
}

export default Page
