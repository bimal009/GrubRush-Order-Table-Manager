"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTable, getTable, deleteTable } from "@/lib/actions/table.actions"
import { CreateTableParams, SerializedHotelTable } from "@/types/tables"

export const useGetTables = () => {
    return useQuery<SerializedHotelTable[], Error>({
        queryKey: ["tables"],
        queryFn: getTable,
    })
}

export const useCreateTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateTableParams) => createTable(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tables"] })
        },
    })
}

export const useDeleteTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (tableId: string) => deleteTable(tableId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tables"] })
        },
    })
}
