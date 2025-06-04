"use client"
import Header from '@/components/elements/desktop/landing/Header'
import React from 'react'
import { motion } from 'framer-motion'

const SiteLayout = ({
    children
}: { children: React.ReactNode }) => {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Header />
            {children}
        </motion.main>
    )
}

export default SiteLayout
