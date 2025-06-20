"use client"

import { createOrder } from "@/lib/actions/order.actions"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: createOrder,
        onSuccess: (data) => {
            console.log("Order created successfully", data)
        },
        onError: (error) => {
            console.log("Error creating order", error)
        }
    })
}
