"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createOrder, deleteOrder, updateOrder, GetOrders, getOrdersByTable, updateOrderStatus, markOrderAsPaid, getOrdersByUser } from "@/lib/actions/order.actions"
import { getTableById } from "@/lib/actions/table.actions"
import { IOrder, IOrderItem } from "@/lib/Database/models/orderModel"
import { ICategory, MenuItem } from "@/types"

// Helper function to generate consistent query keys
const getOrderQueryKeys = {
    all: ['orders'] as const,
    lists: () => [...getOrderQueryKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...getOrderQueryKeys.lists(), filters] as const,
    details: () => [...getOrderQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...getOrderQueryKeys.details(), id] as const,
    byTable: (tableId: string) => [...getOrderQueryKeys.all, 'table', tableId] as const,
    byUser: (userId: string) => [...getOrderQueryKeys.all, 'user', userId] as const,
}

const getTableQueryKeys = {
    all: ['tables'] as const,
    lists: () => [...getTableQueryKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...getTableQueryKeys.lists(), filters || {}] as const,
    details: () => [...getTableQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...getTableQueryKeys.details(), id] as const,
}

function isSingleOrder(data: any): data is IOrder {
    return data && typeof data === 'object' && !Array.isArray(data) && data._id;
}

export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createOrder,
        onSuccess: (data) => {
            // Invalidate all order-related queries using consistent keys
            queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.all })
            queryClient.invalidateQueries({ queryKey: getTableQueryKeys.all })
            
            // If we have table data, invalidate specific table queries
            if (data?.data?.order?.table?._id) {
                const tableId = data.data.order.table._id
                queryClient.invalidateQueries({ queryKey: getTableQueryKeys.detail(tableId) })
                queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.byTable(tableId) })
            }
            
            // If we have user data, invalidate user-specific queries
            if (data?.data?.order?.buyer?._id) {
                queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.byUser(data.data.order.buyer._id) })
            }

            // Force immediate refetch of active queries
            queryClient.refetchQueries({ queryKey: getOrderQueryKeys.all, type: 'active' })
            queryClient.refetchQueries({ queryKey: getTableQueryKeys.all, type: 'active' })
        },
        onError: (error) => {
            console.error("Order creation failed:", error)
        }
    })
}

export const useGetOrders = (page = 1, limit = 50, status?: string) => {
    return useQuery({
        queryKey: getOrderQueryKeys.list({ page, limit, status }),
        queryFn: () => GetOrders(page, limit, status),
        staleTime: 1000 * 15, // Reduced to 15 seconds for more frequent updates
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 30, // More frequent - every 30 seconds
        refetchIntervalInBackground: true,
    })
}

export const useUpdateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ orderId, updateData }: { orderId: string | string[]; updateData: any }) => 
            updateOrder(orderId, updateData),
        onMutate: async ({ orderId, updateData }) => {
            const orderIds = Array.isArray(orderId) ? orderId : [orderId]
            
            // Cancel outgoing refetches for all order queries
            await queryClient.cancelQueries({ queryKey: getOrderQueryKeys.all })
            
            // Get all relevant query data for rollback
            const previousQueries = new Map()
            
            // Save current state of all order list queries
            queryClient.getQueriesData({ queryKey: getOrderQueryKeys.lists() }).forEach(([queryKey, data]) => {
                previousQueries.set(JSON.stringify(queryKey), data)
            })
            
            // Optimistically update all order list queries
            queryClient.setQueriesData({ queryKey: getOrderQueryKeys.lists() }, (old: any) => {
                if (!old?.data?.orders) return old
                
                return {
                    ...old,
                    data: {
                        ...old.data,
                        orders: old.data.orders.map((order: any) => 
                            orderIds.includes(order._id) 
                                ? { ...order, ...updateData, updatedAt: new Date().toISOString() }
                                : order
                        )
                    }
                }
            })
            
            return { previousQueries }
        },
        onError: (err, variables, context) => {
            // Rollback all optimistic updates
            if (context?.previousQueries) {
                context.previousQueries.forEach((data, queryKeyStr) => {
                    const queryKey = JSON.parse(queryKeyStr)
                    queryClient.setQueryData(queryKey, data)
                })
            }
        },
        onSuccess: (data) => {
            // Force immediate cache invalidation and refetch
            queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.all })
            queryClient.invalidateQueries({ queryKey: getTableQueryKeys.all })
            
            // Handle single or multiple orders
            const orders = Array.isArray(data?.data) ? data.data : [data?.data].filter(Boolean)
            
            orders.forEach((order: any) => {
                if (order?.table?._id) {
                    queryClient.invalidateQueries({ queryKey: getTableQueryKeys.detail(order.table._id) })
                    queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.byTable(order.table._id) })
                }
                if (order?.buyer?._id) {
                    queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.byUser(order.buyer._id) })
                }
            })

            // Force immediate refetch of active queries
            queryClient.refetchQueries({ queryKey: getOrderQueryKeys.all, type: 'active' })
            queryClient.refetchQueries({ queryKey: getTableQueryKeys.all, type: 'active' })
        }
    })
}

export const useDeleteOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (orderId: string) => deleteOrder(orderId),
        onMutate: async (orderId) => {
            await queryClient.cancelQueries({ queryKey: getOrderQueryKeys.all })
            
            const previousQueries = new Map()
            
            // Save and optimistically update all order queries
            queryClient.getQueriesData({ queryKey: getOrderQueryKeys.lists() }).forEach(([queryKey, data]) => {
                previousQueries.set(JSON.stringify(queryKey), data)
                
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old?.data?.orders) return old
                    
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            orders: old.data.orders.filter((order: any) => order._id !== orderId),
                            pagination: old.data.pagination ? {
                                ...old.data.pagination,
                                total: Math.max(0, old.data.pagination.total - 1)
                            } : undefined
                        }
                    }
                })
            })
            
            return { previousQueries }
        },
        onError: (err, orderId, context) => {
            if (context?.previousQueries) {
                context.previousQueries.forEach((data, queryKeyStr) => {
                    const queryKey = JSON.parse(queryKeyStr)
                    queryClient.setQueryData(queryKey, data)
                })
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.all })
            queryClient.invalidateQueries({ queryKey: getTableQueryKeys.all })
            
            if (data?.data?.table?._id) {
                queryClient.invalidateQueries({ queryKey: getTableQueryKeys.detail(data.data.table._id) })
                queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.byTable(data.data.table._id) })
            }

            // Force refetch
            queryClient.refetchQueries({ queryKey: getOrderQueryKeys.all, type: 'active' })
            queryClient.refetchQueries({ queryKey: getTableQueryKeys.all, type: 'active' })
        }
    })
} 

export const useGetTableById = (tableId: string) => {
    return useQuery({
        queryKey: getTableQueryKeys.detail(tableId),
        queryFn: () => getTableById(tableId),
        enabled: !!tableId,
        staleTime: 1000 * 15, // 15 seconds
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 15, // 30 seconds
        refetchIntervalInBackground: true,
    })
}

export const useGetOrdersByTable = (tableId: string) => {
    return useQuery({
        queryKey: getOrderQueryKeys.byTable(tableId),
        queryFn: () => getOrdersByTable(tableId),
        enabled: !!tableId,
        staleTime: 1000 * 15,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 15,
        refetchIntervalInBackground: true,
    })
}

export const useGetOrdersByUser = (userId: string) => {
    return useQuery({
        queryKey: getOrderQueryKeys.byUser(userId),
        queryFn: () => getOrdersByUser(userId),
        enabled: !!userId,
        staleTime: 1000 * 15,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 15,
        refetchIntervalInBackground: true,
    })
}

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: string }) => 
            updateOrderStatus(orderId, status),
        onMutate: async ({ orderId, status }) => {
            await queryClient.cancelQueries({ queryKey: getOrderQueryKeys.all })
            
            const previousQueries = new Map()
            
            queryClient.getQueriesData({ queryKey: getOrderQueryKeys.lists() }).forEach(([queryKey, data]) => {
                previousQueries.set(JSON.stringify(queryKey), data)
                
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old?.data?.orders) return old
                    
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            orders: old.data.orders.map((order: any) => 
                                order._id === orderId 
                                    ? { ...order, status, updatedAt: new Date().toISOString() }
                                    : order
                            )
                        }
                    }
                })
            })
            
            return { previousQueries }
        },
        onError: (err, variables, context) => {
            if (context?.previousQueries) {
                context.previousQueries.forEach((data, queryKeyStr) => {
                    const queryKey = JSON.parse(queryKeyStr)
                    queryClient.setQueryData(queryKey, data)
                })
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.all })
            queryClient.invalidateQueries({ queryKey: getTableQueryKeys.all })
            
            if (data.success && "data" in data && isSingleOrder(data.data)) {
                if (data.data?.table?._id) {
                    queryClient.invalidateQueries({ queryKey: getTableQueryKeys.detail(String(data.data.table._id)) })
                    queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.byTable(String(data.data.table._id)) })
                }
                if (data.data?.buyer?._id) {
                    queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.byUser(String(data.data.buyer._id)) })
                }
            }

            // Force refetch
            queryClient.refetchQueries({ queryKey: getOrderQueryKeys.all, type: 'active' })
            queryClient.refetchQueries({ queryKey: getTableQueryKeys.all, type: 'active' })
        }
    })
}

export const useMarkOrderAsPaid = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ orderId }: { orderId: string }) => markOrderAsPaid(orderId),
        onMutate: async ({ orderId }) => {
            await queryClient.cancelQueries({ queryKey: getOrderQueryKeys.all })
            
            const previousQueries = new Map()
            
            queryClient.getQueriesData({ queryKey: getOrderQueryKeys.lists() }).forEach(([queryKey, data]) => {
                previousQueries.set(JSON.stringify(queryKey), data)
                
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old?.data?.orders) return old
                    
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            orders: old.data.orders.map((order: any) => 
                                order._id === orderId 
                                    ? { ...order, isPaid: true, status: 'served', updatedAt: new Date().toISOString() }
                                    : order
                            )
                        }
                    }
                })
            })
            
            return { previousQueries }
        },
        onError: (err, variables, context) => {
            if (context?.previousQueries) {
                context.previousQueries.forEach((data, queryKeyStr) => {
                    const queryKey = JSON.parse(queryKeyStr)
                    queryClient.setQueryData(queryKey, data)
                })
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.all })
            queryClient.invalidateQueries({ queryKey: getTableQueryKeys.all })
            
            // Find and invalidate related queries
            const ordersData = queryClient.getQueryData(getOrderQueryKeys.list({})) as any
            const order = ordersData?.data?.orders?.find((o: any) => o._id === variables.orderId)
            
            if (order?.table?._id) {
                queryClient.invalidateQueries({ queryKey: getTableQueryKeys.detail(String(order.table._id)) })
                queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.byTable(String(order.table._id)) })
            }
            if (order?.buyer?._id) {
                queryClient.invalidateQueries({ queryKey: getOrderQueryKeys.byUser(String(order.buyer._id)) })
            }

            // Force refetch
            queryClient.refetchQueries({ queryKey: getOrderQueryKeys.all, type: 'active' })
            queryClient.refetchQueries({ queryKey: getTableQueryKeys.all, type: 'active' })
        }
    })
}