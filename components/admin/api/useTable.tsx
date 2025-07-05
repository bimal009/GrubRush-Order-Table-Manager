"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTable, getTable, deleteTable, markAvailable, markUnavailable, getTableById } from "@/lib/actions/table.actions"
import { CreateTableParams, SerializedHotelTable } from "@/types/tables"

export const useGetTables = () => {
    return useQuery<SerializedHotelTable[], Error>({
        queryKey: ["tables"],
        queryFn: getTable,
        staleTime: 1000 * 30, // 30 seconds
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 60, // Refetch every minute for real-time table status
    })
}

export const useGetTableById = (tableId: string) => {
    return useQuery<SerializedHotelTable, Error>({
        queryKey: ["tables", tableId],
        queryFn: () => getTableById(tableId),
        enabled: !!tableId,
        staleTime: 1000 * 30,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 45, // More frequent updates for individual table
    });
};

export const useCreateTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateTableParams) => createTable(data),
        onMutate: async (newTable) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["tables"] })
            
            // Snapshot previous value
            const previousTables = queryClient.getQueryData(["tables"])
            
            // Optimistically update tables list
            queryClient.setQueryData(["tables"], (old: SerializedHotelTable[]) => {
                if (!old) return []
                
                const optimisticTable: SerializedHotelTable = {
                    _id: `temp-${Date.now()}`, // Temporary ID
                    tableNumber: newTable.tableNumber,
                    capacity: newTable.capacity,
                    location: newTable.location || '',
                    isAvailable: true,
                    isReserved: false,
                    isPaid: false,
                    status: 'pending',
                    estimatedServeTime: null,
                    reservedBy: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
                
                return [...old, optimisticTable]
            })
            
            return { previousTables }
        },
        onError: (err, newTable, context) => {
            // Rollback optimistic update
            if (context?.previousTables) {
                queryClient.setQueryData(["tables"], context.previousTables)
            }
        },
        onSuccess: (data) => {
            // Invalidate queries to get fresh data with real IDs
            queryClient.invalidateQueries({ queryKey: ["tables"] })
        }
    })
}

export const useDeleteTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (tableId: string) => deleteTable(tableId),
        onMutate: async (tableId) => {
            // Optimistic delete
            await queryClient.cancelQueries({ queryKey: ["tables"] })
            
            const previousTables = queryClient.getQueryData(["tables"])
            
            queryClient.setQueryData(["tables"], (old: SerializedHotelTable[]) => {
                if (!old) return []
                return old.filter(table => table._id !== tableId)
            })
            
            // Remove individual table query
            queryClient.removeQueries({ queryKey: ["tables", tableId] })
            
            return { previousTables }
        },
        onError: (err, tableId, context) => {
            if (context?.previousTables) {
                queryClient.setQueryData(["tables"], context.previousTables)
            }
        },
        onSuccess: (data, tableId) => {
            queryClient.invalidateQueries({ queryKey: ["tables"] })
            queryClient.removeQueries({ queryKey: ["tables", tableId] })
            
            // Also invalidate related order queries
            queryClient.invalidateQueries({ queryKey: ["orders", "tables", tableId] })
        }
    })
}

export const useMarkAvailable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (tableId: string) => markAvailable(tableId),
        onMutate: async (tableId) => {
            // Optimistic update for table availability
            await queryClient.cancelQueries({ queryKey: ["tables"] })
            
            const previousTables = queryClient.getQueryData(["tables"])
            const previousTable = queryClient.getQueryData(["tables", tableId])
            
            // Update tables list
            queryClient.setQueryData(["tables"], (old: SerializedHotelTable[]) => {
                if (!old) return []
                return old.map(table => 
                    table._id === tableId 
                        ? { 
                            ...table, 
                            isAvailable: true, 
                            isReserved: false, 
                            isPaid: false, 
                            status: 'available',
                            reservedBy: null,
                            estimatedServeTime: null
                        }
                        : table
                )
            })
            
            // Update individual table query
            queryClient.setQueryData(["tables", tableId], (old: SerializedHotelTable) => {
                if (!old) return old
                return { 
                    ...old, 
                    isAvailable: true, 
                    isReserved: false, 
                    isPaid: false, 
                    status: 'available',
                    reservedBy: null,
                    estimatedServeTime: null
                }
            })
            
            return { previousTables, previousTable }
        },
        onError: (err, tableId, context) => {
            // Rollback optimistic updates
            if (context?.previousTables) {
                queryClient.setQueryData(["tables"], context.previousTables)
            }
            if (context?.previousTable) {
                queryClient.setQueryData(["tables", tableId], context.previousTable)
            }
        },
        onSuccess: (data, tableId) => {
            // Invalidate to ensure consistency
            queryClient.invalidateQueries({ queryKey: ["tables"] })
            queryClient.invalidateQueries({ queryKey: ["tables", tableId] })
            
            // Invalidate related order queries
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["orders", "tables", tableId] })
            queryClient.invalidateQueries({ queryKey: ["reservations", "tables", tableId] })
        }
    })
}

export const useMarkUnavailable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (tableId: string) => markUnavailable(tableId),
        onMutate: async (tableId) => {
            // Optimistic update for table unavailability
            await queryClient.cancelQueries({ queryKey: ["tables"] })
            
            const previousTables = queryClient.getQueryData(["tables"])
            const previousTable = queryClient.getQueryData(["tables", tableId])
            
            // Update tables list
            queryClient.setQueryData(["tables"], (old: SerializedHotelTable[]) => {
                if (!old) return []
                return old.map(table => 
                    table._id === tableId 
                        ? { 
                            ...table, 
                            isAvailable: false, 
                            isReserved: true, 
                            isPaid: false, 
                            status: 'reserved'
                        }
                        : table
                )
            })
            
            // Update individual table query
            queryClient.setQueryData(["tables", tableId], (old: SerializedHotelTable) => {
                if (!old) return old
                return { 
                    ...old, 
                    isAvailable: false, 
                    isReserved: true, 
                    isPaid: false, 
                    status: 'reserved'
                }
            })
            
            return { previousTables, previousTable }
        },
        onError: (err, tableId, context) => {
            // Rollback optimistic updates
            if (context?.previousTables) {
                queryClient.setQueryData(["tables"], context.previousTables)
            }
            if (context?.previousTable) {
                queryClient.setQueryData(["tables", tableId], context.previousTable)
            }
        },
        onSuccess: (data, tableId) => {
            // Invalidate to ensure consistency
            queryClient.invalidateQueries({ queryKey: ["tables"] })
            queryClient.invalidateQueries({ queryKey: ["tables", tableId] })
            
            // Invalidate related order queries
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["orders", "tables", tableId] })
        }
    })
}

// Additional hook for marking table as paid
export const useMarkTableAsPaid = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (tableId: string) => {
            // Import the action here to avoid circular dependencies
            const { markTableAsPaid } = await import("@/lib/actions/table.actions")
            return markTableAsPaid(tableId)
        },
        onMutate: async (tableId) => {
            await queryClient.cancelQueries({ queryKey: ["tables"] })
            
            const previousTables = queryClient.getQueryData(["tables"])
            const previousTable = queryClient.getQueryData(["tables", tableId])
            
            // Optimistic update
            queryClient.setQueryData(["tables"], (old: SerializedHotelTable[]) => {
                if (!old) return []
                return old.map(table => 
                    table._id === tableId 
                        ? { ...table, isPaid: true }
                        : table
                )
            })
            
            queryClient.setQueryData(["tables", tableId], (old: SerializedHotelTable) => {
                if (!old) return old
                return { ...old, isPaid: true }
            })
            
            return { previousTables, previousTable }
        },
        onError: (err, tableId, context) => {
            if (context?.previousTables) {
                queryClient.setQueryData(["tables"], context.previousTables)
            }
            if (context?.previousTable) {
                queryClient.setQueryData(["tables", tableId], context.previousTable)
            }
        },
        onSuccess: (data, tableId) => {
            queryClient.invalidateQueries({ queryKey: ["tables"] })
            queryClient.invalidateQueries({ queryKey: ["tables", tableId] })
            queryClient.invalidateQueries({ queryKey: ["orders"] })
        }
    })
}