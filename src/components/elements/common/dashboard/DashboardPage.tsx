"use client"
import { useIsMobile } from '@/lib/hooks/responsive/useIsMobile'
import React from 'react'
import DesktopDashboard from '../../desktop/application/dashboard/DDashboard'
import MobileDashboard from '../../mobile/dashboard/MobileDashboard'
import { useGetUserFromSession } from '@/lib/hooks/tanstack-query/query-hook/user/use-get-user-session'
import { Spinner } from '../spinner/spinner'
import { redirect } from 'next/navigation'


const DashboardPage = () => {
  const isMobile = useIsMobile();
  const {data , isLoading : userDataLoading} = useGetUserFromSession();
  console.log("this is data of the user from the sesison : ",data)
  
  if(userDataLoading){
    return <div className='w-full min-h-screen  flex justify-center items-center'>
        <Spinner />
    </div>
  }

  if(!data || !data.userId){
    redirect("/login");
  }

  return isMobile
    ? <MobileDashboard />
    : <DesktopDashboard />
}

export default DashboardPage
