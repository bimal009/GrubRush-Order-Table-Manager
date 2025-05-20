"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCreateTable } from "../../api/useTable"

const formSchema = z.object({
    tableNumber: z.coerce.number().int().min(1, "Table number must be at least 1"),
    capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
    location: z.enum(["indoor", "outdoor"]),
    isAvailable: z.boolean(),
    isReserved: z.boolean(),
    isPaid: z.boolean(),
    status: z.enum(["idle", "processing", "completed"]),
})

type FormSchema = z.infer<typeof formSchema>
type BooleanField = "isAvailable" | "isReserved" | "isPaid"

type CreateTableFormProps = {
    onSuccess?: () => void;
}

export function CreateTableForm({ onSuccess }: CreateTableFormProps) {
    const { mutate: createTable, isPending } = useCreateTable()

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tableNumber: 1,
            capacity: 1,
            location: "indoor",
            isAvailable: false,
            isReserved: false,
            isPaid: false,
            status: "idle",
        },
    })

    const onSubmit = (values: FormSchema) => {
        createTable(values, {
            onSuccess: (data) => {
                console.log("Table created:", data);
                form.reset();
                if (onSuccess) onSuccess();
            },
            onError: (error) => {
                console.error("Create table error:", error);
            },
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="tableNumber"
                    render={({ field }) => (
                        <FormItem key="tableNumber">
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
                    name="capacity"
                    render={({ field }) => (
                        <FormItem key="capacity">
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem key="location">
                            <FormLabel>Location</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="indoor">Indoor</SelectItem>
                                    <SelectItem value="outdoor">Outdoor</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {(["isAvailable", "isReserved", "isPaid"] as BooleanField[]).map((name) => (
                    <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <FormLabel className="capitalize">{name}</FormLabel>
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
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem key="status">
                            <FormLabel>Status</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="idle">Idle</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create Table"}
                </Button>
            </form>
        </Form>
    )
}
