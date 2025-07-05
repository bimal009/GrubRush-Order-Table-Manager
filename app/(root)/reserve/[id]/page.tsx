"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import Loader from "@/components/Loader"
import { useGetTableById } from "@/components/admin/api/useTable"
import { useCreateReservation } from "@/components/admin/api/useReservations"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const reservationSchema = z.object({
    customerName: z.string().min(1, "Name is required"),
    customerPhone: z.string().min(10, "A valid phone number is required"),
    numberOfGuests: z.coerce.number().min(1, "At least one guest is required"),
    reservationDate: z.date({ required_error: "Reservation date is required" }),
    reservationTime: z.string().min(1, "Reservation time is required"),
    specialRequests: z.string().optional(),
})

type ReservationFormData = z.infer<typeof reservationSchema>

const ReservationPage = () => {
    const { id } = useParams()
    const { userId } = useAuth()
    const { data: table, isLoading: isTableLoading } = useGetTableById(id as string)
    const { mutate: createReservation, isPending: isReserving } = useCreateReservation()

    const form = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            customerName: "",
            customerPhone: "",
            numberOfGuests: 1,
            reservationDate: undefined,
            reservationTime: "",
            specialRequests: "",
        },
    })

    const onSubmit = (values: ReservationFormData) => {
        if (!userId || !table) return

        if (values.numberOfGuests > table.capacity) {
            form.setError("numberOfGuests", {
                type: "manual",
                message: `Number of guests cannot exceed table capacity of ${table.capacity}`,
            })
            return
        }

        createReservation(
            { ...values, tableId: table._id, userId },
            {
                onSuccess: () => {
                    toast.success("Table reserved successfully!")
                    form.reset()
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to reserve table.")
                },
            }
        )
    }

    if (isTableLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader />
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 mt-10">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-2">Reserve Table #{table?.tableNumber}</h1>
                    <p className="text-gray-600 mb-6">Capacity: {table?.capacity} people</p>
                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="customerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="customerPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="(123) 456-7890" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="reservationDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Reservation Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="reservationTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reservation Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" {...field} value={field.value ?? ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="numberOfGuests"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of Guests</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" max={table?.capacity} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="specialRequests"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Special Requests</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Any special requests? (e.g., dietary restrictions, seating preference)"
                                                className="resize-none"
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isReserving}>
                                {isReserving ? "Reserving..." : "Confirm Reservation"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ReservationPage