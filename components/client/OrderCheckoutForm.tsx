"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Trash2, Plus, Minus } from "lucide-react"
import { useEffect, useState, useMemo } from "react"

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
import { Separator } from "@/components/ui/separator"
import { useOrderStore } from "@/lib/stores/orderStore"
import { useGetTables } from "../admin/api/useTable"
import { useGetMenu } from "../admin/api/useMenu"
import { useCreateOrder } from "./api/useOrder"
import { useAuth } from "@clerk/nextjs"

// Form validation schema
const orderSchema = z.object({
    orderItems: z.array(z.object({
        menuItem: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
        specialInstructions: z.string().optional(),
        estimatedServeTime: z.number().optional(),
    })).optional(),
    table: z.string().min(1, "Table selection is required"),
    buyer: z.string().min(1, "Buyer ID is required"),
    totalAmount: z.string(),
    quantity: z.number(),
}).refine((data) => data.orderItems && data.orderItems.length > 0, {
    message: "At least one item is required",
    path: ["orderItems"],
})

type OrderFormData = z.infer<typeof orderSchema>

interface OrderCheckoutFormProps {
    trigger?: React.ReactNode
    onSuccess?: () => void
    initialItems?: Array<{menuItem: string, name: string, price: number, quantity: number}>
    tableId?: string
}

function OrderCheckoutForm({ trigger, onSuccess, initialItems = [], tableId }: OrderCheckoutFormProps) {
    const { orders, addItem, removeItem, clearOrder } = useOrderStore()
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false) // Separate state for submit status
    
    const {mutate: createOrder} = useCreateOrder(() => {
        setIsSubmitting(false) // Reset submitting state
        // Clear the order store after successful submission
        clearOrder()
        // Reset form immediately
        form.reset({
            orderItems: [],
            table: tableId || "",
            buyer: user.userId || "",
            totalAmount: "",
            quantity: 0,
        })
        setIsOpen(false)
        if (onSuccess) onSuccess()
    }, () => {
        setIsSubmitting(false) // Reset submitting state on error
    })
    
    const {data: tables} = useGetTables()
    const user = useAuth()
    console.log("user", user)
    
    const table = useMemo(() => 
        tables?.find((table) => table._id === tableId), 
        [tables, tableId]
    )

    const form = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            orderItems: orders.length > 0 ? orders.map(item => ({
                ...item,
                specialInstructions: ""
            })) : [],
            table: tableId || "",
            buyer: user.userId || "",
            totalAmount: "",
            quantity: 0,
        },
    })

    const watchedItems = form.watch("orderItems")

    const removeItemFromForm = (index: number) => {
        const currentItems = form.getValues("orderItems") || []
        form.setValue("orderItems", currentItems.filter((_, i) => i !== index))
    }

    const updateQuantity = (index: number, change: number) => {
        const currentItems = form.getValues("orderItems") || []
        const newQuantity = Math.max(1, currentItems[index].quantity + change)
        form.setValue(`orderItems.${index}.quantity`, newQuantity)
    }

    // Memoize calculations to prevent unnecessary re-renders
    const totals = useMemo(() => {
        const items = watchedItems || []
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const tax = subtotal * 0.1 // 10% tax
        return {
            subtotal: subtotal.toFixed(2),
            tax: tax.toFixed(2),
            total: (subtotal + tax).toFixed(2)
        }
    }, [watchedItems])

    const onSubmit = (values: OrderFormData) => {
        setIsSubmitting(true) // Set submitting state
        
        const totalAmount = totals.total
        const totalQuantity = watchedItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
        
        // Create a completely isolated order data object
        const cleanOrderItems = (values.orderItems || []).map(item => ({
            menuItem: String(item.menuItem),
            name: String(item.name),
            price: Number(item.price),
            quantity: Number(item.quantity),
            specialInstructions: String(item.specialInstructions || ""),
            estimatedServeTime: Number(item.estimatedServeTime || 0)
        }))
        
        const orderData = {
            orderItems: cleanOrderItems,
            table: String(values.table),
            buyer: String(values.buyer),
            totalAmount: String(totalAmount),
            quantity: Number(totalQuantity),
        }
        
        console.log("Submitting order with", orderData.orderItems?.length || 0, "items")
        console.log("Order data structure:", {
            orderItemsCount: orderData.orderItems?.length,
            table: orderData.table,
            buyer: orderData.buyer,
            totalAmount: orderData.totalAmount,
            quantity: orderData.quantity
        })
        
        createOrder(orderData)
    }

    useEffect(() => {
        const orderItems = orders.length > 0 ? orders.map(item => ({
            ...item,
            specialInstructions: ""
        })) : []
        
        form.reset({
            orderItems,
            table: tableId || "",
            buyer: user.userId || "",
            totalAmount: "",
            quantity: 0,
        })
    }, [orders, tableId, user.userId]) // Removed 'form' from dependencies

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && (
                <div onClick={() => setIsOpen(true)}>
                    <DialogTrigger asChild>
                        {trigger}
                    </DialogTrigger>
                </div>
            )}
            
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order Checkout</DialogTitle>
                    <DialogDescription>
                        Review your selected items and complete your order.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Order Items */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Order Items</h3>
                            </div>
                            
                            {(!watchedItems || watchedItems.length === 0) ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No items selected. Please add items from the menu first.</p>
                                </div>
                            ) : (
                                watchedItems.map((item, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium">{item.name}</h4>
                                                    <span className="font-medium">${item.price.toFixed(2)}</span>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(index, -1)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(index, 1)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                    <span className="ml-4 font-medium text-green-600">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="ml-4">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItemFromForm(index)}
                                                    disabled={isSubmitting}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <FormField
                                            control={form.control}
                                            name={`orderItems.${index}.specialInstructions`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Special Instructions (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="No onions, extra sauce, etc..."
                                                            className="resize-none"
                                                            disabled={isSubmitting}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Table Selection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Table Information</h3>
                            
                            <FormField
                                control={form.control}
                                name="table"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Table</FormLabel>
                                        <div className="text-sm text-gray-500">
                                            Table No: {table?.tableNumber}
                                        </div>
                                        <input type="hidden" {...field} value={table?._id || ""} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Estimated Serve Time Display */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Estimated Serve Time</h3>
                            <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                                {(watchedItems?.length || 0) > 1 
                                    ? "Order will be served together and soon" 
                                    : `Estimated serve time: ${watchedItems?.[0]?.estimatedServeTime || 0} minutes`}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <h3 className="text-lg font-medium mb-3">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${totals.subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (10%):</span>
                                    <span>${totals.tax}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span>${totals.total}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting || !watchedItems?.length} 
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting ? "Processing..." : "Place Order"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default OrderCheckoutForm