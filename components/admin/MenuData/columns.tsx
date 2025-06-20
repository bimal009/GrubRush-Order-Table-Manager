"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MenuItem } from "@/types"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import HandleDeleteButton from "../MenuData/HandleDeleteButton"

export const columns: ColumnDef<MenuItem>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const imageUrl = row.getValue("image") as string;
            return (
                <div className="w-16 h-16 relative">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={row.original.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                    )}
                </div>
            );
        }
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.original.category;
            return <div className="capitalize">{category?.name || 'N/A'}</div>;
        }
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <div className="text-right">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "isAvailable",
        header: "Availability",
        cell: ({ row }) => {
            const isAvailable = row.getValue("isAvailable")
            return <Badge variant={isAvailable ? "outline" : "secondary"}>{isAvailable ? "Available" : "Not Available"}</Badge>
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const menuItem = row.original
            return <HandleDeleteButton id={menuItem._id} />
        },
    },
] 