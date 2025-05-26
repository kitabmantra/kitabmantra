"use client"
import { useIsMobile } from '@/lib/hooks/responsive/useIsMobile'
import React from 'react'
import DesktopDashboard from '../../desktop/application/dashboard/DDashboard'
import MobileDashboard from '../../mobile/dashboard/MobileDashboard'

interface DashboardPageProps {
  userId: string
}
const DashboardPage = ({
  userId,
}: DashboardPageProps) => {
  const isMobile = useIsMobile();
  console.log(userId)
  return isMobile
    ? <MobileDashboard />
    : <DesktopDashboard />
}

export default DashboardPage
