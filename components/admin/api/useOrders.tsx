"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMenu } from "@/lib/actions/menu.actions"
import { createOrder, deleteOrder, updateOrder } from "@/lib/actions/order.actions"



export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
        },
    })
}

export const useUpdateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateOrder,
        onSuccess: (data: { _id: string }) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["order", data._id] })
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