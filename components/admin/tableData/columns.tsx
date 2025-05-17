"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, CircleSlash, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"


type TableStatus = "available" | "reserved" | "occupied" | "unavailable"

export type TableManagement = {
    _id?: string
    tableNo: number
    isAvailable: boolean
    tableStatus: TableStatus
    orderStatus: "pending" | "processing" | "completed" | "cancelled"
    amount: number
}

export const columns: ColumnDef<TableManagement>[] = [
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
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "tableNo",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-4"
            >
                Table Number
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">T-{row.getValue("tableNo")}</div>,
    },
    {
        accessorKey: "tableStatus",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("tableStatus") as TableStatus

            const colorMap: Record<TableStatus, string> = {
                available: "green",
                reserved: "yellow",
                occupied: "blue",
                unavailable: "destructive",
            }

            return (
                <Badge variant={colorMap[status] as "green" | "yellow" | "blue" | "destructive"}>
                    <span className="capitalize">{status}</span>
                </Badge>
            )
        },
    },
    {
        accessorKey: "orderStatus",
        header: "Order",
        cell: ({ row }) => {
            const status = row.getValue("orderStatus") as string
            const variant = {
                pending: "yellow",
                processing: "blue",
                completed: "green",
                cancelled: "destructive",
            }[status]

            return (
                <Badge variant={variant as "green" | "blue" | "yellow" | "destructive" | "default"}>
                    <span className="capitalize">{status}</span>
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: () => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs">Table Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-sm cursor-pointer">
                            <Clock className="mr-2 h-4 w-4" />
                            View Orders
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm cursor-pointer">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark Available
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-sm cursor-pointer text-red-600 focus:text-red-700">
                            <CircleSlash className="mr-2 h-4 w-4" />
                            Delete Table
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
