'use client'
import React, { useState, useEffect } from 'react'
import { Clock, CheckCircle, Package, Ban, RotateCcw, Loader2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useGetOrdersByUser, useUpdateOrder } from '../admin/api/useOrders'
import { useGetMenu } from '../admin/api/useMenu'
import { useUpdateOrderStatus } from './api/useOrder'
import { useQueryClient } from '@tanstack/react-query'
import { MenuItem, Order, OrderItem, TableInfo } from '@/types'
import { TooltipProvider } from '@/components/ui/tooltip'
import { OrderHeader } from './order/OrderHeader'
import { OrderList } from './order/OrderList'
import { IOrder, IOrderItem } from '@/lib/Database/models/orderModel'

const OrdersPage = () => {
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [editingOrder, setEditingOrder] = useState<string | null>(null)
    const [showAddItems, setShowAddItems] = useState<boolean>(false)
    const [orders, setOrders] = useState<Order[]>([])
    
    const { user } = useUser()
    const queryClient = useQueryClient()
    const { data: ordersResponse, isLoading } = useGetOrdersByUser(user?.publicMetadata.userId as string)
    const {data: menuData, isLoading: menuItemsLoading} = useGetMenu()
    const { mutate: updateOrderStatus } = useUpdateOrderStatus()
    const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder()

    useEffect(() => {
        if (ordersResponse?.data) {
            const mappedOrders: Order[] = (ordersResponse.data.filter(Boolean) as unknown as IOrder[]).map((apiOrder) => {
                const createdAt = new Date(apiOrder.createdAt)
                return {
                    _id: apiOrder._id.toString(),
                    id: apiOrder._id.toString(),
                    restaurant: 'GrubRush Restaurant',
                    date: createdAt.toLocaleDateString(),
                    time: createdAt.toLocaleTimeString(),
                    status: apiOrder.status as Order['status'],
                    items: apiOrder.orderItems.map((item: IOrderItem) => ({
                        id: item._id.toString(),
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    total: parseFloat(apiOrder.totalAmount),
                    estimatedArrival: apiOrder.estimatedServeTime ? `${apiOrder.estimatedServeTime} minutes` : undefined,
                    createdAt: apiOrder.createdAt.toString(),
                    cancelReason: undefined,
                    table: apiOrder.table ? { ...apiOrder.table, _id: apiOrder.table.toString() } as unknown as TableInfo : null,
                }
            })
            setOrders(mappedOrders)
        }
    }, [ordersResponse])
    

    // Helper functions for order editing
    const canEditOrder = (status: string): boolean => {
        return status === 'preparing'
    }

    const calculateOrderTotal = (items: OrderItem[]): number => {
        return items.reduce((total: number, item: OrderItem) => total + (item.price * item.quantity), 0)
    }

    const updateOrderQuantity = (orderId: string, itemId: string | number, newQuantity: number): void => {
        setOrders(prevOrders =>
            prevOrders.map(order => {
                if (order.id === orderId) {
                    const updatedItems = order.items.map(item =>
                        item.id === itemId ? { ...item, quantity: newQuantity } : item
                    ).filter(item => item.quantity > 0)
                    
                    return {
                        ...order,
                        items: updatedItems,
                        total: calculateOrderTotal(updatedItems)
                    }
                }
                return order
            })
        )
    }

    const addItemToOrder = (orderId: string, menuItem: MenuItem): void => {
        setOrders(prevOrders =>
            prevOrders.map(order => {
                if (order.id === orderId) {
                    const existingItem = order.items.find(item => item.name === menuItem.name)
                    let updatedItems: OrderItem[]
                    
                    if (existingItem) {
                        updatedItems = order.items.map(item =>
                            item.name === menuItem.name
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    } else {
                        const newItem: OrderItem = {
                            id: menuItem._id, 
                            name: menuItem.name,
                            quantity: 1,
                            price: menuItem.price
                        }
                        updatedItems = [...order.items, newItem]
                    }
                    
                    return {
                        ...order,
                        items: updatedItems,
                        total: calculateOrderTotal(updatedItems)
                    }
                }
                return order
            })
        )
    }

    const removeItemFromOrder = (orderId: string, itemId: string | number): void => {
        setOrders(prevOrders =>
            prevOrders.map(order => {
                if (order.id === orderId) {
                    const updatedItems = order.items.filter(item => item.id !== itemId)
                    return {
                        ...order,
                        items: updatedItems,
                        total: calculateOrderTotal(updatedItems)
                    }
                }
                return order
            })
        )
    }

    const startEditing = (orderId: string): void => {
        setEditingOrder(orderId)
        setShowAddItems(true)
    }

    const stopEditing = (): void => {
        setEditingOrder(null)
        setShowAddItems(false)
    }

    const saveOrderChanges = async (orderId: string): Promise<void> => {
        const orderToUpdate = orders.find(o => o.id === orderId)
        if (!orderToUpdate) return

        const updateData = {
            orderItems: orderToUpdate.items.map(item => ({
                menuItem: item.id.toString(),
                quantity: item.quantity,
                price: item.price,
                name: item.name
            })),
            totalAmount: orderToUpdate.total,
        }

        updateOrder({ orderId, updateData }, {
            onSuccess: () => {
                stopEditing()
                queryClient.invalidateQueries({ queryKey: ["orders", "user", user?.publicMetadata.userId as string] })
            },
            onError: (error) => {
                console.error('Failed to update order:', error)
            }
        })
    }

    const reorderItems = (orderId: string): void => {
        const order = orders.find((o) => o.id === orderId)
        if (order) {
            console.log('Reordering items from order:', orderId)
            localStorage.setItem('reorderItems', JSON.stringify(order.items))
            window.location.href = '/select-tables'
        }
    }

    const canCancelOrder = (order: Order): boolean => {
        if (order.status !== 'preparing') return false
        
        const orderTime = new Date(order.createdAt).getTime()
        const now = new Date().getTime()
        const diffInMinutes = (now - orderTime) / (1000 * 60)
        return diffInMinutes < 5
    }

    const cancelOrder = (orderId: string) => {
        updateOrderStatus({ orderId, status: 'cancelled' }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['orders', user?.publicMetadata.userId as string] })
            }
        })
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'served':
            case 'completed':
                return 'default'
            case 'preparing':
                return 'secondary'
            case 'cancelled':
                return 'destructive'
            case 'pending':
                return 'outline'
            default:
                return 'outline'
        }
    }

    const getStatusIcon = (status: string): React.ReactNode => {
        switch (status) {
            case 'served':
            case 'completed':
                return <CheckCircle className="w-4 h-4" />
            case 'preparing':
                return <Clock className="w-4 h-4" />
            case 'cancelled':
                return <Ban className="w-4 h-4" />
            case 'pending':
                return <Package className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'served':
                return 'Served'
            case 'completed':
                return 'Completed'
            case 'preparing':
                return 'Preparing'
            case 'cancelled':
                return 'Cancelled'
            case 'pending':
                return 'Pending'
            default:
                return 'Unknown'
        }
    }

    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : orders.filter((order: Order) => order.status === filterStatus)

    if (isLoading || menuItemsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    <p className="text-gray-600">Loading your orders...</p>
                </div>
            </div>
        )
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen ">
                <OrderHeader 
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    getStatusText={getStatusText}
                />
                <OrderList 
                    orders={filteredOrders}
                    filterStatus={filterStatus}
                    getStatusText={getStatusText}
                    editingOrder={editingOrder}
                    startEditing={startEditing}
                    stopEditing={stopEditing}
                    canEditOrder={canEditOrder}
                    saveOrderChanges={saveOrderChanges}
                    reorderItems={reorderItems}
                    canCancelOrder={canCancelOrder}
                    cancelOrder={cancelOrder}
                    getStatusVariant={getStatusVariant}
                    getStatusIcon={getStatusIcon}
                    updateOrderQuantity={updateOrderQuantity}
                    removeItemFromOrder={removeItemFromOrder}
                    addItemToOrder={addItemToOrder}
                    menuItems={menuData?.items || []}
                    showAddItems={showAddItems}
                    setShowAddItems={setShowAddItems}
                />
            </div>
        </TooltipProvider>
    )
}

export default OrdersPage