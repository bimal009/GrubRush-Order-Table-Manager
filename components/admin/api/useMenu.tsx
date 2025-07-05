"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {  getMenu, createMenuItem, deleteMenuItem, updateMenuItem, toggleMenuItemAvailability } from "@/lib/actions/menu.actions"
import { MenuItem, CreateMenuParams } from "@/types"
import { toast } from "sonner"

export const useGetMenu = (query?: string, category?: string, page?: number, limit?: number) => {
    return useQuery<{ items: MenuItem[]; pagination: any }>({
        queryKey: ["menu", query, category, page, limit],
        queryFn: async () => {
            const response = await getMenu(query, category, page, limit)
            if (response?.error) {
                throw new Error(response.error)
                
            }
            return response?.data || { items: [], pagination: {} }
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

export const useUpdateMenu = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, menuItem }: { id: string; menuItem: CreateMenuParams }) => {
            const data = await updateMenuItem(id, menuItem)
            if (data?.error) {
                throw new Error(data.error)
            }
            return data?.data
        },
        onSuccess: () => {
            toast.success("Menu item updated successfully!")
            queryClient.invalidateQueries({ queryKey: ["menu"] })
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update menu item.")
        },
    })
}

export const useToggleAvailability = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, isAvailable }: { id: string; isAvailable: boolean }) => {
            const data = await toggleMenuItemAvailability(id, isAvailable)
            if (data?.error) {
                throw new Error(data.error)
            }
            return data?.data
        },
        onSuccess: (_, { isAvailable }) => {
            const status = isAvailable ? "available" : "unavailable"
            toast.success(`Menu item marked as ${status}!`)
            queryClient.invalidateQueries({ queryKey: ["menu"] })
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update availability.")
        },
    })
}

