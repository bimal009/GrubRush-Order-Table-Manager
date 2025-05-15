import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import React from 'react'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className=' px-4 md:px-8 lg:px-16 mx-auto'>
            <Header />
            <NuqsAdapter>{children}</NuqsAdapter>
            <Footer />
        </main>
    )
}

export default RootLayout