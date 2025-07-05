'use client'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Order, MenuItem } from '@/types'
import { OrderCardHeader } from './OrderCardHeader'
import { OrderDetails } from './OrderDetails'

interface OrderCardProps {
    order: Order
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
    getStatusText: (status: string) => string
    updateOrderQuantity: (orderId: string, itemId: string | number, newQuantity: number) => void
    removeItemFromOrder: (orderId: string, itemId: string | number) => void
    addItemToOrder: (orderId: string, menuItem: MenuItem) => void
    menuItems: MenuItem[]
    showAddItems: boolean
    setShowAddItems: (show: boolean) => void
}

export const OrderCard = ({ 
    order,
    editingOrder,
    startEditing,
    stopEditing,
    canEditOrder,
    saveOrderChanges,
    reorderItems,
    canCancelOrder,
    cancelOrder,
    getStatusVariant,
    getStatusIcon,
    getStatusText,
    updateOrderQuantity,
    removeItemFromOrder,
    addItemToOrder,
    menuItems,
    showAddItems,
    setShowAddItems
}: OrderCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded)
    }

    const isEditing = editingOrder === order.id
    const canEdit = canEditOrder(order.status)
    const canCancel = canCancelOrder(order)

    return (
        <Card className="overflow-hidden">
            <OrderCardHeader
                order={order}
                isExpanded={isExpanded}
                toggleExpansion={toggleExpansion}
                getStatusVariant={getStatusVariant}
                getStatusIcon={getStatusIcon}
                getStatusText={getStatusText}
                isEditing={isEditing}
                canEdit={canEdit}
                canCancel={canCancel}
                saveOrderChanges={saveOrderChanges}
                stopEditing={stopEditing}
                reorderItems={reorderItems}
                startEditing={startEditing}
                cancelOrder={cancelOrder}
            />

            {isExpanded && (
                <CardContent className="border-t bg-gray-50/50 pt-6">
                    <OrderDetails
                        order={order}
                        isEditing={isEditing}
                        canEdit={canEdit}
                        showAddItems={showAddItems}
                        menuItems={menuItems || []}
                        updateOrderQuantity={updateOrderQuantity}
                        removeItemFromOrder={removeItemFromOrder}
                        addItemToOrder={addItemToOrder}
                        setShowAddItems={setShowAddItems}
                        canCancel={canCancel}
                        saveOrderChanges={saveOrderChanges}
                        stopEditing={stopEditing}
                        reorderItems={reorderItems}
                        startEditing={startEditing}
                        cancelOrder={cancelOrder}
                    />
                </CardContent>
            )}
        </Card>
    )
} 