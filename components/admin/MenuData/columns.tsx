"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MenuItem } from "@/types"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import ActionDropdown from "./ActionDropdown"

export const columns: ColumnDef<MenuItem>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "image",
        header: () => <div className="text-center">Image</div>,
        cell: ({ row }) => {
            const imageUrl = row.getValue("image") as string;
            return (
                <div className="flex items-center justify-center">
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={row.original.name}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-200"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500 font-medium">No Image</span>
                            </div>
                        )}
                    </div>
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
                className="font-semibold text-gray-700 hover:text-gray-900 -ml-4"
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-semibold text-gray-800 capitalize">
                {row.getValue("name")}
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: () => <div className="text-center">Category</div>,
        cell: ({ row }) => {
            const category = row.original.category;
            return (
                <div className="text-center">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 font-medium capitalize">
                        {category?.name || 'N/A'}
                    </Badge>
                </div>
            );
        }
    },
    {
        accessorKey: "preparationTime",
        header: () => <div className="text-center">ETA</div>,
        cell: ({ row }) => {
            const preparationTime = row.original.preparationTime;
            return (
                <div className="text-center">
                    {preparationTime ? (
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 font-medium">
                            {preparationTime} min
                        </Badge>
                    ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                    )}
                </div>
            );
        }
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <div className="text-right">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="font-semibold text-gray-700 hover:text-gray-900"
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
                currency: "NPR",
            }).format(amount)

            return (
                <div className="text-right font-bold text-lg text-gray-800">
                    {formatted}
                </div>
            )
        },
    },
    {
        accessorKey: "isAvailable",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const isAvailable = row.getValue("isAvailable")
            return (
                <div className="flex items-center justify-center">
                    <Badge 
                        variant={isAvailable ? "default" : "destructive"}
                        className={`font-medium px-3 py-1 rounded-full ${
                            isAvailable 
                                ? "bg-green-100 text-green-800 border border-green-200" 
                                : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                    >
                        {isAvailable ? "Available" : "Not Available"}
                    </Badge>
                </div>
            )
        }
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        enableHiding: false,
        cell: ({ row }) => {
            const menuItem = row.original
            return (
                <div className="flex justify-center">
                    <ActionDropdown id={menuItem._id} name={menuItem.name} menuItem={menuItem} />
                </div>
            )
        },
    },
] 