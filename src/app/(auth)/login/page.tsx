import LoginForm from '@/components/elements/desktop/auth/login-form'
import React from 'react'
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const Page =async () => {
const session = await auth();
if(session && session.user && session.user.id) redirect("/onboarding")
  return (
    <div className="min-h-screen min-w-screen w-full h-full flex justify-center items-center">
      <LoginForm />
    </div>
  );
}

export default Page;