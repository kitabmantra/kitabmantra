import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import OnboardingForm from '@/components/elements/desktop/onboarding/onboarding-form';
import { getUser } from '@/lib/actions/user/get/getUser';

const Page = async () => {
  const session = await auth();
  if (!session || !session?.user || !session.user?.id) redirect("/login");
  const user = await getUser(session.user.id);
  //if already user is in db, user is already onbaorded
  if (user.success && user.formattedUserData) redirect("/dashboard");

  return (
    <div className="min-h-screen min-w-screen w-full h-full flex justify-center items-center">
      <OnboardingForm session={session} />
    </div>
  )
}

export default Page
