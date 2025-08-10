import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import OnboardingForm from '@/components/elements/desktop/onboarding/onboarding-form';
import { getUserFromId } from '@/lib/actions/user/get/getUserFromId';
import { setUserSession } from '@/lib/actions/user/session/setUserSession';

const Page = async () => {
  const session = await auth();
  if (!session || !session?.user || !session.user?.id) redirect("/login");
  
  const user = await getUserFromId(session.user.id);
  
  //if already user is in db, user is already onboarded
  if (user) {
    // Set user session cookie if user exists
    await setUserSession(user.userName, user.email, user.userId);
    redirect("/");
  }
  
  return (
    <div className="min-h-screen min-w-screen w-full h-full ">
      <OnboardingForm session={session} />
    </div>
  )
}

export default Page
