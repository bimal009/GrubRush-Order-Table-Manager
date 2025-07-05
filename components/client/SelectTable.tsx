import React from 'react'
import { useGetTables } from '../admin/api/useTable'
import MenuCard from './shared/MenuCard'

const SelectTable = () => {
    const {data:tables, isLoading}=useGetTables()

    if(isLoading) return <div>Loading...</div>

    return (
    <div className='p-4 h-screen mt-10'>
        <h1 className='text-2xl text-center mb-5 font-bold mb-4'>Select Your Table</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {tables?.map((table)=>(
                <MenuCard key={table._id} item={table} type="table" tableCardType="select" />
            ))}
        </div>
    </div>
  )
}

export default SelectTable