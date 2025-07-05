"use client"
import React from 'react'
import { useGetTables } from '../admin/api/useTable'
import MenuCard from './shared/MenuCard';
import { SerializedHotelTable } from '@/types/tables';
import Loader from '../Loader';

const ReserveTable = () => {
    const { data: tables, isLoading } = useGetTables()
    console.log(tables)
    if (isLoading) { 
        return <div className='h-screen flex items-center justify-center'>
            <Loader />
        </div>
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Reserve Your Table</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {tables?.map((table: SerializedHotelTable) => (
                        <MenuCard key={table._id} item={table} type="table" />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ReserveTable