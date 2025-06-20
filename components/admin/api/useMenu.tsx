"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {  getMenu, createMenuItem, deleteMenuItem } from "@/lib/actions/menu.actions"
import { MenuItem, CreateMenuParams } from "@/types"
import { toast } from "sonner"

export const useGetMenu = (query?: string) => {
    return useQuery<MenuItem[]>({
        queryKey: ["menu", query],
        queryFn: async () => {
            const data = await getMenu(query)
            if (data?.error) {
                throw new Error(data.error)
            }
            return data?.data || []
        },
    })
}

export const useCreateMenu = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (menuItem: CreateMenuParams) => {
            const data = await createMenuItem(menuItem)
            if (data?.error) {
                throw new Error(data.error)
            }
            return data?.data
        },
        onSuccess: () => {
            toast.success("Menu item created successfully!")
            queryClient.invalidateQueries({ queryKey: ["menu"] })
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create menu item.")
        },
    })
}

export const useDeleteMenu = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            const data = await deleteMenuItem({ id })
            if (data?.error) {
                throw new Error(data.error)
            }
            return data
        },
        onSuccess: () => {
            toast.success("Menu item deleted successfully!")
            queryClient.invalidateQueries({ queryKey: ["menu"] })
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete menu item.")
        },
    })
}

