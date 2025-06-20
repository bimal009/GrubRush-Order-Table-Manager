"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

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
import { Checkbox } from "@/components/ui/checkbox"
import CloudinaryUploader from "@/components/CloudinaryUploader"
import { useCreateMenu } from "../api/useMenu"
import { useGetCategories } from "../api/useCategories"

// Form validation schema
const menuItemSchema = z.object({
    name: z.string().min(1, "Item name is required").max(100, "Name too long"),
    description: z.string().min(1, "Description is required").max(500, "Description too long"),
    price: z.coerce.number().min(0, "Price must be positive"),
    category: z.string().min(1, "Category selection is required"),
    image: z.string().optional(),
    isAvailable: z.boolean(),
    preparationTime: z.number().min(1).max(120).optional(),
})

type MenuItemFormData = z.infer<typeof menuItemSchema>

// Mock data for categories - replace with your actual data fetchin

interface CreateMenuItemFormProps {
    trigger?: React.ReactNode
    onSuccess?: () => void
    // Add your API hook here
    // useCreateMenuItem?: () => { mutate: Function, isPending: boolean }
}

function CreateMenuItemForm({ trigger, onSuccess }: CreateMenuItemFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { mutate: createMenuItem, isPending: isCreating } = useCreateMenu()
    const { data: categories } = useGetCategories()
    // Replace with your actual API hook
    // const { mutate: createMenuItem, isPending } = useCreateMenuItem()

    const form = useForm<MenuItemFormData>({
        resolver: zodResolver(menuItemSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            category: "",
            image: "",
            isAvailable: true,
            preparationTime: undefined,
        },
    })

    const handleImageUpload = (secureUrl: string) => {
        form.setValue("image", secureUrl);
    };

    const handleImageError = (error: string) => {
        console.error("Image upload error:", error);
        // You might want to show this error to the user
        // form.setError("image", { message: error });
    };

    const onSubmit = (values: MenuItemFormData) => {
        createMenuItem(values, {
            onSuccess: (data) => {
                console.log("Menu item created:", data)
                form.reset()
                if (onSuccess) onSuccess()
                setIsOpen(false)
            },
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Menu Item</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new item to your menu.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Basic Information</h3>
                            
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Grilled Chicken Breast" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tender grilled chicken breast served with seasonal vegetables and herbs..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price ($)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="15.99"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    onFocus={(e) => e.target.select()}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories?.map((category) => (
                                                        <SelectItem key={category._id} value={category._id}>
                                                            {category.name}
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
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image Upload</FormLabel>
                                        <FormControl>
                                            <CloudinaryUploader
                                                onUploadSuccess={handleImageUpload}
                                                onUploadError={handleImageError}
                                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''} // Make sure this preset exists in your Cloudinary dashboard
                                                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''} // Fixed environment variable name
                                                folder={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''}
                                                currentImageUrl={field.value}
                                                showPreview={true}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Additional Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Additional Details</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="preparationTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preparation Time (minutes)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="120"
                                                    placeholder="15"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(value === '' ? undefined : parseInt(value, 10));
                                                    }}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isAvailable"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Available</FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? "Creating..." : "Add Menu Item"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateMenuItemForm