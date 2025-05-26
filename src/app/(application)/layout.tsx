import Sidebar from '@/components/elements/desktop/bars/sidebars/Sidebar';
import { getCurrentUser } from '@/lib/actions/user/get/getCurrentUser'
import { redirect } from 'next/navigation';
import React from 'react'


const ApplicationLayout = async ({
    children
}: { children: React.ReactNode }) => {
    const user = await getCurrentUser();
    if (!user) redirect("/login")
    return (
        <div className='flex gap-2'>
            <Sidebar user={user} />
            {children}
        </div>
    )
}

export default ApplicationLayout
