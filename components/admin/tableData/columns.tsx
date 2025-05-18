"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
    MoreHorizontal,
    CircleSlash,
    Clock,
    CheckCircle2,
    Loader2,
} from "lucide-react"
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

export type HotelTable = {
    _id?: string
    tableNumber: number
    capacity: number
    location: "indoor" | "outdoor"
    isAvailable: boolean
    isReserved: boolean
    isPaid: boolean
    status: "idle" | "processing" | "completed"
    estimatedServeTime?: string | null // ISO string
}

export const columns: ColumnDef<HotelTable>[] = [
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
        accessorKey: "tableNumber",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-4"
            >
                Table No.
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">T-{row.getValue("tableNumber")}</div>,
    },
    {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => <div>{row.getValue("capacity")} people</div>,
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
            const loc = row.getValue("location")
            return (
                <Badge variant="secondary" className="capitalize">
                    {loc}
                </Badge>
            )
        },
    },
    {
        accessorKey: "isAvailable",
        header: "Available",
        cell: ({ row }) => {
            const isAvailable = row.getValue("isAvailable")
            return isAvailable ? (
                <Badge variant="green">Yes</Badge>
            ) : (
                <Badge variant="destructive">No</Badge>
            )
        },
    },
    {
        accessorKey: "isReserved",
        header: "Reserved",
        cell: ({ row }) => {
            const reserved = row.getValue("isReserved")
            return reserved ? (
                <Badge variant="yellow">Yes</Badge>
            ) : (
                <Badge variant="secondary">No</Badge>
            )
        },
    },
    {
        accessorKey: "isPaid",
        header: "Paid",
        cell: ({ row }) => {
            const paid = row.getValue("isPaid")
            return paid ? (
                <Badge variant="green">Yes</Badge>
            ) : (
                <Badge variant="default">No</Badge>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Order Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as HotelTable["status"];
            const colorMap = {
                idle: "default",
                processing: "blue",
                completed: "green",
            };
            const iconMap = {
                idle: <Clock className="inline mr-1 w-4 h-4" />,
                processing: <Loader2 className="inline mr-1 w-4 h-4 animate-spin" />,
                completed: <CheckCircle2 className="inline mr-1 w-4 h-4" />,
            };

            return (
                <Badge variant={colorMap[status] as any} className="capitalize flex items-center">
                    {iconMap[status]}
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "estimatedServeTime",
        header: "ETA",
        cell: ({ row }) => {
            const eta = row.getValue("estimatedServeTime") as string | null
            if (!eta) return <span className="text-muted-foreground">N/A</span>

            const date = new Date(eta)
            return (
                <span>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const id = row.original._id
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
