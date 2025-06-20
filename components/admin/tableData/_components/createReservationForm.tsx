"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// Form validation schema
const reservationSchema = z.object({
    reservationDate: z.date({
        required_error: "Reservation date is required",
    }),
    reservationTime: z.string().min(1, "Reservation time is required").regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Time must be in HH:MM format"
    ),
    guestCount: z.number().min(1, "Guest count must be at least 1"),
    guestInfo: z.object({
        name: z.string().min(1, "Guest name is required").max(100, "Name too long"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(1, "Phone number is required"),
    }),
    specialRequests: z.string().max(500, "Special requests too long").optional(),
    tableId: z.string().min(1, "Table selection is required"),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
})

type ReservationFormData = z.infer<typeof reservationSchema>

// Mock data for tables - replace with your actual data fetching
const mockTables = [
    { id: "1", tableNumber: 1, capacity: 2, location: "indoor" },
    { id: "2", tableNumber: 2, capacity: 4, location: "indoor" },
    { id: "3", tableNumber: 3, capacity: 6, location: "outdoor" },
    { id: "4", tableNumber: 4, capacity: 8, location: "outdoor" },
]

// Time slots for reservation
const timeSlots = [
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"
]

interface ReservationModalProps {
    trigger?: React.ReactNode
    onSuccess?: () => void
    // Add your API hook here
    // useCreateReservation?: () => { mutate: Function, isPending: boolean }
}

function CreateReservationForm({ trigger, onSuccess }: ReservationModalProps) {
    // Replace with your actual API hook
    // const { mutate: createReservation, isPending } = useCreateReservation()
    const isPending = false // Mock loading state

    const form = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            guestCount: 2,
            status: 'pending',
            guestInfo: {
                name: "",
                email: "",
                phone: "",
            },
            specialRequests: "",
        },
    })

    const onSubmit = (values: ReservationFormData) => {
        console.log("Reservation data:", values)
        
        // Replace with your actual API call
        // createReservation(values, {
        //     onSuccess: (data) => {
        //         console.log("Reservation created:", data)
        //         form.reset()
        //         if (onSuccess) onSuccess()
        //     },
        //     onError: (error) => {
        //         console.error("Create reservation error:", error)
        //     },
        // })

        // Mock success for demo
        setTimeout(() => {
            form.reset()
            if (onSuccess) onSuccess()
        }, 1000)
    }

    return (
        <Dialog>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Make a Reservation</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to make a new table reservation.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Guest Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Guest Information</h3>
                            
                            <FormField
                                control={form.control}
                                name="guestInfo.name"
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

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="guestInfo.email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="email" 
                                                    placeholder="john@example.com" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="guestInfo.phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="+1 (555) 123-4567" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Reservation Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Reservation Details</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="reservationDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
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
                                                        disabled={(date) =>
                                                            date < new Date() || date < new Date("1900-01-01")
                                                        }
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
                                            <FormLabel>Time</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select time" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {timeSlots.map((time) => (
                                                        <SelectItem key={time} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="guestCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Number of Guests</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    min="1" 
                                                    max="20"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tableId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preferred Table</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select table" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {mockTables.map((table) => (
                                                        <SelectItem key={table.id} value={table.id}>
                                                            Table {table.tableNumber} ({table.capacity} seats, {table.location})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Special Requests */}
                        <FormField
                            control={form.control}
                            name="specialRequests"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Special Requests (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any special dietary requirements, seating preferences, or other requests..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating..." : "Make Reservation"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateReservationForm