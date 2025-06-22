"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMenu } from "@/lib/actions/menu.actions"
import { createOrder, deleteOrder, updateOrder, GetOrders, getOrdersByTable, updateOrderStatus, markOrderAsPaid } from "@/lib/actions/order.actions"
import { getTableById } from "@/lib/actions/table.actions"



export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
        },
    })
}

export const useGetOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: GetOrders,
    })
}

export const useUpdateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ orderId, updateData }: { orderId: string; updateData: any }) => updateOrder(orderId, updateData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            if (data?.data?._id) {
                queryClient.invalidateQueries({ queryKey: ["order", data.data._id] })
            }
        },
    })
}

export const useDeleteOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (orderId: string) => deleteOrder(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
        },
    })
} 


export const useGetTableById = (tableId: string) => {
    return useQuery({
        queryKey: ["table", tableId],
        queryFn: () => getTableById(tableId)
    })
}

export const useGetOrdersByTable = (tableId: string) => {
    return useQuery({
        queryKey: ["orders", "table", tableId],
        queryFn: () => getOrdersByTable(tableId),
        enabled: !!tableId
    })
}


export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: string }) => updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["tables"] })


        },
    })
}

export const useMarkOrderAsPaid = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ orderId }: { orderId: string }) => markOrderAsPaid(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["tables"] })
        },
    })
}

