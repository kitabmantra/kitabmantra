import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import OnboardingForm from '@/components/elements/desktop/onboarding/onboarding-form';
import { getUserFromId } from '@/lib/actions/user/get/getUserFromId';

const Page = async () => {
  const session = await auth();
  if (!session || !session?.user || !session.user?.id) redirect("/login");
  const user = await getUserFromId(session.user.id);
  //if already user is in db, user is already onbaorded
  if (user) redirect("/dashboard");
  return (
    <div className="min-h-screen min-w-screen w-full h-full ">
      <OnboardingForm session={session} />
    </div>
  )
}

export default Page
