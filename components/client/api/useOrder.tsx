"use client"

import { createOrder, getOrderById, GetOrders, updateOrderStatus } from "@/lib/actions/order.actions"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreateOrder = (onSuccess?: () => void, onError?: () => void) => {
    return useMutation({
        mutationFn: createOrder,
        onSuccess: (response) => {
            console.log("Order created successfully", response?.success)
            if (onSuccess && response?.success) {
                onSuccess()
            }
        },
        onError: (error) => {
            console.log("Error creating order", error)
            if (onError) {
                onError()
            }
        }
    })
}


export const useGetOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: () => GetOrders()
    })
}

export const useGetOrderById = (orderId: string) => {
    return useQuery({
        queryKey: ["order", orderId],
        queryFn: () => getOrderById(orderId)
    })

}

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string, status: string }) => updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        }
    })
}





