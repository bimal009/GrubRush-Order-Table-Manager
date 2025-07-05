"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
    MoreHorizontal,
    Clock,
    CheckCircle2,
    Loader2,
    User,
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
import { Badge } from "@/components/ui/badge"
import DeleteButton from "./DeleteButton"
import MarkAvailableButton from "./MarkAvailableButton"
import ViewOrderButton from "./VeiwOrderButton"

export type HotelTable = {
    _id?: string
    tableNumber: number
    capacity: number
    location: "indoor" | "outdoor"
    isAvailable: boolean
    isReserved: boolean
    isPaid: boolean
    status: 'pending' | 'preparing' | 'served' | 'cancelled';
    estimatedServeTime: string | null
    reservedBy: {
        name?: string;
        email?: string;
        phone?: string;
    } | null
}

export const columns: ColumnDef<HotelTable>[] = [
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
        cell: ({ row }) => <div className="font-medium ml-2">T-{row.getValue("tableNumber")}</div>,
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
            const loc = row.getValue("location") as "indoor" | "outdoor"
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
        accessorKey: "reservedBy",
        header: "Reserved By",
        cell: ({ row }) => {
            const reservedBy = row.getValue("reservedBy") as HotelTable["reservedBy"]
            return (
                <div className="font-medium ml-2">
                    {reservedBy?.name || <User className="w-4 h-4" />}
                </div>
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
            const colorMap: Record<HotelTable["status"], "default" | "blue" | "green" | "destructive"> = {
                pending: "default",
                preparing: "blue",
                served: "green",
                cancelled: "destructive",
            };
            const iconMap = {
                pending: <Clock className="inline mr-1 w-4 h-4" />,
                preparing: <Loader2 className="inline mr-1 w-4 h-4 animate-spin" />,
                served: <CheckCircle2 className="inline mr-1 w-4 h-4" />,
                cancelled: <Clock className="inline mr-1 w-4 h-4" />,
            };

            return (
                <Badge variant={colorMap[status]} className="capitalize flex items-center">
                    {iconMap[status]}
                    {status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <div className="relative">
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
                            {row.original._id && <ViewOrderButton tableId={row.original._id.toString()} />}
                               
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-sm cursor-pointer">
                            {row.original._id && <MarkAvailableButton tableId={row.original._id.toString()} />}
                            </DropdownMenuItem>
                           
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-sm cursor-pointer text-red-600 focus:text-red-700"
                                onSelect={(e) => e.preventDefault()}
                            >
                                {row.original._id && <DeleteButton tableId={row.original._id.toString()} />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
