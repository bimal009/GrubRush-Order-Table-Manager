"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createReservation, updateReservation } from "@/lib/actions/reservation.action"

export const useCreateReservation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createReservation,
        onMutate: async (reservationData) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["tables"] })
            await queryClient.cancelQueries({ queryKey: ["reservations"] })
            
            // Snapshot previous values
            const previousTables = queryClient.getQueryData(["tables"])
            const previousTable = queryClient.getQueryData(["tables", reservationData.tableId])
            const previousReservations = queryClient.getQueryData(["reservations"])
            
            // Check if reservation is for today
            const today = new Date()
            const reservationDate = new Date(reservationData.reservationDate)
            today.setHours(0, 0, 0, 0)
            reservationDate.setHours(0, 0, 0, 0)
            const isToday = reservationDate.getTime() === today.getTime()
            
            // Optimistically update table status if reservation is for today
            if (isToday) {
                queryClient.setQueryData(["tables"], (old: any) => {
                    if (!old) return []
                    return old.map((table: any) => 
                        table._id === reservationData.tableId 
                            ? { 
                                ...table, 
                                isAvailable: false, 
                                status: 'reserved',
                                reservedBy: {
                                    name: reservationData.customerName,
                                    phone: reservationData.customerPhone,
                                    email: null // Will be filled by server
                                }
                            }
                            : table
                    )
                })
                
                queryClient.setQueryData(["tables", reservationData.tableId], (old: any) => {
                    if (!old) return old
                    return { 
                        ...old, 
                        isAvailable: false, 
                        status: 'reserved',
                        reservedBy: {
                            name: reservationData.customerName,
                            phone: reservationData.customerPhone,
                            email: null
                        }
                    }
                })
            }
            
            // Optimistically add reservation to list
            queryClient.setQueryData(["reservations"], (old: any) => {
                if (!old) return []
                
                const optimisticReservation = {
                    _id: `temp-${Date.now()}`,
                    table: reservationData.tableId,
                    user: reservationData.userId,
                    guestCount: reservationData.numberOfGuests,
                    guestInfo: {
                        name: reservationData.customerName,
                        phone: reservationData.customerPhone,
                        email: null
                    },
                    reservationDate: reservationData.reservationDate,
                    reservationTime: reservationData.reservationTime,
                    specialRequests: reservationData.specialRequests,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
                
                return Array.isArray(old) ? [...old, optimisticReservation] : [optimisticReservation]
            })
            
            return { previousTables, previousTable, previousReservations }
        },
        onError: (err, reservationData, context) => {
            // Rollback optimistic updates on error
            if (context?.previousTables) {
                queryClient.setQueryData(["tables"], context.previousTables)
            }
            if (context?.previousTable) {
                queryClient.setQueryData(["tables", reservationData.tableId], context.previousTable)
            }
            if (context?.previousReservations) {
                queryClient.setQueryData(["reservations"], context.previousReservations)
            }
            console.error("Reservation creation failed:", err)
        },
        onSuccess: (data, reservationData) => {
            // Invalidate all related queries to get fresh data
            queryClient.invalidateQueries({ queryKey: ["tables"] })
            queryClient.invalidateQueries({ queryKey: ["reservations"] })
            
            // Specifically invalidate the table that was reserved
            queryClient.invalidateQueries({ queryKey: ["tables", reservationData.tableId] })
            
            // Invalidate user-specific reservations if we track them
            queryClient.invalidateQueries({ queryKey: ["reservations", "user", reservationData.userId] })
            
            // Invalidate orders related to this table
            queryClient.invalidateQueries({ queryKey: ["orders", "tables", reservationData.tableId] })
        },
        onSettled: () => {
            // Ensure all data is fresh after the mutation settles
            queryClient.invalidateQueries({ queryKey: ["tables"] })
            queryClient.invalidateQueries({ queryKey: ["reservations"] })
        }
    })
}

// Additional hooks for reservation management
export const useGetReservations = () => {
    const queryClient = useQueryClient()
    
    return {
        // You can add more reservation-related queries here
        invalidateReservations: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] })
        },
        
        // Helper to get reservations from cache
        getReservationsFromCache: () => {
            return queryClient.getQueryData(["reservations"])
        }
    }
}

// Hook for canceling reservations (if needed)

interface CancelReservationContext {
    previousReservations: unknown;
}

export const useCancelReservation = () => {
    const queryClient = useQueryClient()

    return useMutation<any, Error, string, CancelReservationContext>({
        mutationFn: async (reservationId: string) => {
            // You'll need to implement this action
            // const { cancelReservation } = await import("@/lib/actions/reservation.action")
            // return cancelReservation(reservationId)
            throw new Error("Cancel reservation action not implemented yet")
        },
        onMutate: async (reservationId) => {
            await queryClient.cancelQueries({ queryKey: ["reservations"] })
            
            const previousReservations = queryClient.getQueryData(["reservations"])
            
            // Optimistically remove reservation
            queryClient.setQueryData(["reservations"], (old: any) => {
                if (!Array.isArray(old)) return old
                return old.filter((reservation: any) => reservation._id !== reservationId)
            })
            
            return { previousReservations }
        },
        onError: (err, reservationId, context) => {
            if (context?.previousReservations) {
                queryClient.setQueryData(["reservations"], context.previousReservations)
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] })
            queryClient.invalidateQueries({ queryKey: ["tables"] })
            
            // If the canceled reservation had a table, invalidate that table
            if (data?.tableId) {
                queryClient.invalidateQueries({ queryKey: ["tables", data.tableId] })
            }
        }
    })
}

interface UpdateReservationData {
    reservationId: string;
    updateData: {
        customerName?: string;
        customerPhone?: string;
        numberOfGuests?: number;
        reservationDate?: Date;
        reservationTime?: string;
        specialRequests?: string;
        status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    };
}

export const useUpdateReservation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateReservationData) => updateReservation(data),
        onMutate: async ({ reservationId, updateData }) => {
            await queryClient.cancelQueries({ queryKey: ["reservations"] });
            
            const previousReservations = queryClient.getQueryData(["reservations"]);

            queryClient.setQueryData(["reservations"], (old: any[] | undefined) => {
                if (!old) return [];
                return old.map(reservation => {
                    if (reservation._id === reservationId) {
                        const updatedReservation = { ...reservation };

                        if (updateData.customerName) updatedReservation.guestInfo.name = updateData.customerName;
                        if (updateData.customerPhone) updatedReservation.guestInfo.phone = updateData.customerPhone;
                        if (updateData.numberOfGuests) updatedReservation.guestCount = updateData.numberOfGuests;
                        if (updateData.reservationDate) updatedReservation.reservationDate = updateData.reservationDate.toISOString();
                        if (updateData.reservationTime) updatedReservation.reservationTime = updateData.reservationTime;
                        if (updateData.specialRequests) updatedReservation.specialRequests = updateData.specialRequests;
                        if (updateData.status) updatedReservation.status = updateData.status;

                        return updatedReservation;
                    }
                    return reservation;
                });
            });

            return { previousReservations };
        },
        onError: (err, variables, context: any) => {
            if (context?.previousReservations) {
                queryClient.setQueryData(["reservations"], context.previousReservations);
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["tables"] });
            if (data.table) {
                const tableId = typeof data.table === 'string' ? data.table : data.table._id;
                queryClient.invalidateQueries({ queryKey: ["tables", tableId] });
            }
        },
        onSettled: () => {
             queryClient.invalidateQueries({ queryKey: ["reservations"] });
             queryClient.invalidateQueries({ queryKey: ["tables"] });
        }
    });
};