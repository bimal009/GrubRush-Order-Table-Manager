
import Search from '@/components/shared/Search'
import React from 'react'
interface PageProps {
    searchParams: { query: string }
}


const menu = async ({ searchParams }: PageProps) => {
    const { query } = await searchParams
    console.log(query)
    return (
        <main>
            <Search />
        </main>
    )
}

export default menu
