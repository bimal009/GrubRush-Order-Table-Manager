import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default RootLayout