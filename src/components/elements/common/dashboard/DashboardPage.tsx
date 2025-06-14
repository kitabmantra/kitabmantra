"use client"
import { useIsMobile } from '@/lib/hooks/responsive/useIsMobile'
import React, { useEffect } from 'react'
import DesktopDashboard from '../../desktop/application/dashboard/DDashboard'
import MobileDashboard from '../../mobile/dashboard/MobileDashboard'
import { useGetUserFromSession } from '@/lib/hooks/tanstack-query/query-hook/user/use-get-user-session'
import { Spinner } from '../spinner/spinner'
import { redirect } from 'next/navigation'
import { useUserStore } from '@/lib/hooks/store/user/useUserStore'


const DashboardPage = () => {
  const isMobile = useIsMobile();
  const { data, isLoading: userDataLoading } = useGetUserFromSession();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (userDataLoading || user) return;
    if (data) {
      setUser(data);
    }

  }, [userDataLoading, user, data, setUser])

  if (userDataLoading) {
    return <div className='w-full min-h-screen  flex justify-center items-center'>
      <Spinner />
    </div>
  }

  if (!data || !data.userId) {
    redirect("/login");
  }

  return isMobile
    ? <MobileDashboard />
    : <DesktopDashboard />
}

export default DashboardPage
