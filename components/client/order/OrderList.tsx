'use client'
import React from 'react'
import { Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Order, MenuItem } from '@/types'
import { OrderCard } from './OrderCard'

export interface OrderListProps {
    orders: Order[]
    filterStatus: string
    getStatusText: (status: string) => string
    editingOrder: string | null
    startEditing: (orderId: string) => void
    stopEditing: () => void
    canEditOrder: (status: string) => boolean
    saveOrderChanges: (orderId: string) => Promise<void>
    reorderItems: (orderId: string) => void
    canCancelOrder: (order: Order) => boolean
    cancelOrder: (orderId: string) => void
    getStatusVariant: (status: string) => "default" | "secondary" | "destructive" | "outline"
    getStatusIcon: (status: string) => React.ReactNode
    updateOrderQuantity: (orderId: string, itemId: string | number, newQuantity: number) => void
    removeItemFromOrder: (orderId: string, itemId: string | number) => void
    addItemToOrder: (orderId: string, menuItem: MenuItem) => void
    menuItems: MenuItem[]
    showAddItems: boolean
    setShowAddItems: (show: boolean) => void
}

export const OrderList = (props: OrderListProps) => {
    const { orders, filterStatus, getStatusText } = props;
    return (
        <main className="container mx-auto px-4 py-6 sm:py-8">
            {orders.length === 0 ? (
                <Card className="text-center py-16">
                    <CardContent className="pt-6">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-600">
                            {filterStatus === 'all' 
                                ? "You haven't placed any orders yet." 
                                : `No ${getStatusText(filterStatus).toLowerCase()} orders found.`
                            }
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: Order) => (
                        <OrderCard key={order.id} {...props} order={order} />
                    ))}
                </div>
            )}
        </main>
    )
} 