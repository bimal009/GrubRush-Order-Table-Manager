"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    customerName: z.string().min(2, "Customer name must be at least 2 characters"),
    customerEmail: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
    customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
    tableNumber: z.coerce.number().int().min(1, "Table number must be at least 1"),
    itemName: z.string().min(1, "Item name is required"),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
    unitPrice: z.coerce.number().min(0, "Unit price must be at least 0"),
    totalAmount: z.coerce.number().min(0, "Total amount must be at least 0"),
    orderType: z.enum(["dine-in", "takeaway", "delivery"]),
    paymentMethod: z.enum(["cash", "card", "digital"]),
    isPaid: z.boolean(),
    isCompleted: z.boolean(),
    status: z.enum(["pending", "preparing", "ready", "served", "cancelled"]),
    specialInstructions: z.string().optional(),
})

type FormSchema = z.infer<typeof formSchema>
type BooleanField = "isPaid" | "isCompleted"

type CreateOrderModalProps = {
    onSuccess?: () => void;
    trigger?: React.ReactNode;
}

export function CreateOrderModal({ onSuccess, trigger }: CreateOrderModalProps) {
    const { mutate: createOrder, isPending } = useCreateOrder()

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            tableNumber: 1,
            itemName: "",
            quantity: 1,
            unitPrice: 0,
            totalAmount: 0,
            orderType: "dine-in",
            paymentMethod: "cash",
            isPaid: false,
            isCompleted: false,
            status: "pending",
            specialInstructions: "",
        },
    })

    // Watch quantity and unitPrice to calculate total
    const quantity = form.watch("quantity")
    const unitPrice = form.watch("unitPrice")
    
    React.useEffect(() => {
        const total = quantity * unitPrice
        form.setValue("totalAmount", total)
    }, [quantity, unitPrice, form])

    const onSubmit = (values: FormSchema) => {
        createOrder(values, {
            onSuccess: (data) => {
                console.log("Order created:", data);
                form.reset();
                if (onSuccess) onSuccess();
            },
            onError: (error) => {
                console.error("Create order error:", error);
            },
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || <Button>Create New Order</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Order</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Customer Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Customer Information</h3>
                            
                            <FormField
                                control={form.control}
                                name="customerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Customer Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter customer name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="customerEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Customer Email (Optional)</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Enter email address" {...field} />
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
                                        <FormLabel>Customer Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter phone number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Order Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Order Details</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="tableNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Table Number</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="orderType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Order Type</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select order type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="dine-in">Dine In</SelectItem>
                                                    <SelectItem value="takeaway">Takeaway</SelectItem>
                                                    <SelectItem value="delivery">Delivery</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <FormField
                                control={form.control}
                                name="itemName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter item name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="unitPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="totalAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Amount</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" readOnly {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Payment & Status */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Payment & Status</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Method</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select payment method" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="cash">Cash</SelectItem>
                                                    <SelectItem value="card">Card</SelectItem>
                                                    <SelectItem value="digital">Digital Payment</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
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
                                                    <SelectItem value="preparing">Preparing</SelectItem>
                                                    <SelectItem value="ready">Ready</SelectItem>
                                                    <SelectItem value="served">Served</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <div className="space-y-4">
                                {(["isPaid", "isCompleted"] as BooleanField[]).map((name) => (
                                    <FormField
                                        key={name}
                                        control={form.control}
                                        name={name}
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between">
                                                <FormLabel className="capitalize">
                                                    {name === "isPaid" ? "Is Paid" : "Is Completed"}
                                                </FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <FormField
                            control={form.control}
                            name="specialInstructions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Special Instructions (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter any special instructions for the order"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? "Creating Order..." : "Create Order"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}