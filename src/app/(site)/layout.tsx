import Header from '@/components/elements/desktop/landing/Header'
import React from 'react'

const SiteLayout = ({
    children
}: { children: React.ReactNode }) => {
    return (
        <main>
            <Header />
            {children}
        </main>
    )
}

export default SiteLayout
