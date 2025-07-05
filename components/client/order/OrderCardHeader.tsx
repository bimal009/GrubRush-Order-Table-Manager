'use client'
import React from 'react'
import { ChevronDown, ChevronUp, Clock, Ban } from 'lucide-react'
import { Order } from '@/types'
import { CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { OrderActionButtons } from './OrderActionButtons'

interface OrderCardHeaderProps {
    order: Order
    isExpanded: boolean
    toggleExpansion: () => void
    getStatusVariant: (status: string) => "default" | "secondary" | "destructive" | "outline"
    getStatusIcon: (status: string) => React.ReactNode
    getStatusText: (status: string) => string
    // Props for OrderActionButtons
    isEditing: boolean
    canEdit: boolean
    canCancel: boolean
    saveOrderChanges: (orderId: string) => void
    stopEditing: () => void
    reorderItems: (orderId: string) => void
    startEditing: (orderId: string) => void
    cancelOrder: (orderId: string) => void
}

export const OrderCardHeader = ({
    order,
    isExpanded,
    toggleExpansion,
    getStatusVariant,
    getStatusIcon,
    getStatusText,
    ...actionButtonProps
}: OrderCardHeaderProps) => {
    return (
        <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {order.items.length} items
                            </h3>
                            <Badge variant={getStatusVariant(order.status)} className="w-fit">
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{getStatusText(order.status)}</span>
                            </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Restaurant:</span> {order.restaurant}</p>
                            <p><span className="font-medium">Date:</span> {order.date} at {order.time}</p>
                            {order.status === 'preparing' && order.estimatedArrival && (
                                <Alert className="mt-2">
                                    <Clock className="h-4 w-4" />
                                    <AlertDescription>
                                        <span className="font-medium">Estimated ready:</span> {order.estimatedArrival}
                                    </AlertDescription>
                                </Alert>
                            )}
                            {order.status === 'cancelled' && order.cancelReason && (
                                <Alert variant="destructive" className="mt-2">
                                    <Ban className="h-4 w-4" />
                                    <AlertDescription>
                                        <span className="font-medium">Reason:</span> {order.cancelReason}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                            <p className="text-xl sm:text-2xl font-bold text-primary">${order.total.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">{order.items.length} items</p>
                        </div>
                        
                        <Button
                            onClick={toggleExpansion}
                            variant="ghost"
                            size="icon"
                        >
                            {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </div>
                
                {!isExpanded && (
                    <OrderActionButtons order={order} {...actionButtonProps} />
                )}
            </div>
        </CardHeader>
    )
} 