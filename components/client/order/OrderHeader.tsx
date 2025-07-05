'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface OrderHeaderProps {
    filterStatus: string
    setFilterStatus: (status: string) => void
    getStatusText: (status: string) => string
}

export const OrderHeader = ({ filterStatus, setFilterStatus, getStatusText }: OrderHeaderProps) => {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-600 mt-1">Track and manage your food orders</p>
                    </div>
                    
                    <ScrollArea className="w-full">
                        <div className="flex gap-2 pb-2">
                            {['all', 'pending', 'preparing', 'served', 'cancelled'].map((status) => (
                                <Button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    variant={filterStatus === status ? 'default' : 'outline'}
                                    size="sm"
                                    className="whitespace-nowrap"
                                >
                                    {status === 'all' ? 'All Orders' : getStatusText(status)}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </header>
    )
} 