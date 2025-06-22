"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
    MoreHorizontal,
    Clock,
    CheckCircle2,
    Loader2,
    User,
    Receipt,
    XCircle,
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
import ViewOrderButton from "./VeiwOrderButton"
import MarkCompletedButton from "./MarkCompletedButton"
import React from "react"
import MarkAsPaidButton from "./MarkAsPaidButton"

export type Order = {
    _id: string
    createdAt: string
    totalAmount: string
    table: {
        _id: string
        tableNumber: number
        capacity: number
        location: "indoor" | "outdoor"
    }
    buyer: {
        _id: string
        username: string
        email: string
    }
    estimatedServeTime?: number | null
    quantity: number
    status: 'pending' | 'preparing' | 'served' | 'cancelled'
    isPaid: boolean;
    orderItems: Array<{
        menuItem: string
        name: string
        price: number
        quantity: number
        specialInstructions?: string
        estimatedServeTime?: number
    }>
}

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "_id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-4"
            >
                Order ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const id = row.getValue("_id") as string
            return <div className="font-medium ml-2">#{id.slice(-6)}</div>
        },
    },
    {
        accessorKey: "table.tableNumber",
        header: "Table",
        cell: ({ row }) => {
            const table = row.original.table
            return <div className="font-medium">T-{table?.tableNumber || 'N/A'}</div>
        },
    },
    {
        accessorKey: "buyer.username",
        header: "Customer",
        cell: ({ row }) => {
            const buyer = row.original.buyer
            return (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{buyer?.username || 'Unknown'}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "quantity",
        header: "Items",
        cell: ({ row }) => <div>{row.getValue("quantity")} items</div>,
    },
    {
        accessorKey: "totalAmount",
        header: "Total",
        cell: ({ row }) => {
            const amount = row.getValue("totalAmount") as string
            return (
                <div className="font-medium text-green-600">
                    ${parseFloat(amount).toFixed(2)}
                </div>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return (
                <div className="text-sm text-muted-foreground">
                    {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
            )
        },
    },
    {
        accessorKey: "isPaid",
        header: "Payment",
        cell: ({ row }) => {
            const isPaid = row.getValue("isPaid") as boolean
            return isPaid ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Paid
                </Badge>
            ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                    Unpaid
                </Badge>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            
            const getStatusConfig = (status: string) => {
                switch (status) {
                    case 'pending':
                        return {
                            icon: <Clock className="w-3 h-3 mr-1" />,
                            badge: <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center">Pending</Badge>
                        }
                    case 'preparing':
                        return {
                            icon: <Loader2 className="w-3 h-3 mr-1 animate-spin" />,
                            badge: <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center">Preparing</Badge>
                        }
                    case 'served':
                        return {
                            icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
                            badge: <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center">Served</Badge>
                        }
                    case 'cancelled':
                        return {
                            icon: <XCircle className="w-3 h-3 mr-1" />,
                            badge: <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center">Cancelled</Badge>
                        }
                    default:
                        return {
                            icon: <Clock className="w-3 h-3 mr-1" />,
                            badge: <Badge variant="secondary" className="flex items-center">Unknown</Badge>
                        }
                }
            }

            const config = getStatusConfig(status)
            
            return (
                <div className="flex items-center gap-2">
                   {
                        // @ts-ignore
                   React.cloneElement(config.badge, {}, config.icon, config.badge.props.children)}
                </div>
            )
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
                            <DropdownMenuLabel className="text-xs">Order Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-sm cursor-pointer">
                                {row.original._id && <ViewOrderButton tableId={row.original.table._id} />}
                            </DropdownMenuItem>
                            {row.original.status !== 'served' && (
                                <DropdownMenuItem className="text-sm cursor-pointer">
                                    {row.original._id && <MarkCompletedButton tableId={row.original._id} />}
                                </DropdownMenuItem>
                            )}
                            {!row.original.isPaid && (
                                <DropdownMenuItem className="text-sm cursor-pointer">
                                    {row.original._id && <MarkAsPaidButton orderId={row.original._id} />}
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-sm cursor-pointer text-red-600 focus:text-red-700"
                                onSelect={(e) => e.preventDefault()}
                            >
                                {row.original._id && <DeleteButton tableId={row.original._id} />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
