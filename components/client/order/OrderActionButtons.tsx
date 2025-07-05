'use client'
import React from 'react'
import { Ban, Plus, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Order } from '@/types'

interface OrderActionButtonsProps {
    order: Order
    isEditing: boolean
    canEdit: boolean
    canCancel: boolean
    saveOrderChanges: (orderId: string) => void
    stopEditing: () => void
    reorderItems: (orderId: string) => void
    startEditing: (orderId: string) => void
    cancelOrder: (orderId: string) => void
}

export const OrderActionButtons = ({
    order,
    isEditing,
    canEdit,
    canCancel,
    saveOrderChanges,
    stopEditing,
    reorderItems,
    startEditing,
    cancelOrder,
}: OrderActionButtonsProps) => {
    if (isEditing && canEdit) {
        return (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button 
                    onClick={() => saveOrderChanges(order.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                >
                    Save Changes
                </Button>
                <Button 
                    onClick={stopEditing}
                    variant="secondary"
                    className="flex-1"
                >
                    Cancel
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row gap-2 w-full">
            {order.status === 'served' && (
                <Button 
                    onClick={() => reorderItems(order.id)}
                    className="flex-1"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reorder
                </Button>
            )}
            
            {order.status === 'preparing' && (
                <>
                    <Button
                        onClick={() => startEditing(order.id)}
                        variant="secondary"
                        className="flex-1"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                    </Button>
                    
                    {canCancel ? (
                        <Button
                            onClick={() => cancelOrder(order.id)}
                            variant="destructive"
                            className="flex-1"
                        >
                            <Ban className="w-4 h-4 mr-2" />
                            Cancel Order
                        </Button>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex-1">
                                    <Button
                                        disabled
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Ban className="w-4 h-4 mr-2" />
                                        Cancel Order
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>You can only cancel an order within 5 minutes.</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </>
            )}
        </div>
    )
} 