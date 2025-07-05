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
import React from "react"
import ViewOrderButton from "./ViewOrderButton"
import MarkAllAsPaidButton from "./MarkAllAsPaidButton"
import BulkUpdateStatusButton from "./BulkUpdateStatusButton"

export interface SerializedTable {
    _id: string;
    tableNumber: number;
    capacity: number;
    location: 'indoor' | 'outdoor';
    status: string;
    isAvailable: boolean;
    isReserved: boolean;
    isPaid: boolean;
    currentOrders: string[];
}

export interface SerializedOrder {
    _id: string;
    createdAt: string;
    updatedAt: string;
    totalAmount: string;
    quantity: number;
    status: 'pending' | 'preparing' | 'served' | 'cancelled' | 'completed';
    isPaid: boolean;
    estimatedServeTime?: number;
    buyer: any;
    table: SerializedTable | null;
    orderItems: any[];
}

export interface GroupedOrder {
    table: SerializedTable;
    orders: SerializedOrder[];
    totalOrders: number;
    totalAmount: number;
    status: string;
    _id: string;
    isPaid: boolean;
}


export const columns: ColumnDef<GroupedOrder>[] = [
    {
        id: "tableNumber",
        accessorKey: "table.tableNumber",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="-ml-4"
            >
                Table
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const tableNumber = row.original.table.tableNumber;
            return <div className="font-medium ml-2">T-{tableNumber}</div>
        },
    },
    {
        accessorKey: "totalOrders",
        header: "Total Orders",
        cell: ({ row }) => {
            return <div>{row.getValue("totalOrders")} orders</div>
        },
    },
    {
        accessorKey: "totalAmount",
        header: "Total Amount",
        cell: ({ row }) => {
            const amount = row.getValue("totalAmount") as number;
            return (
                <div className="font-medium text-green-600">
                    ${amount.toFixed(2)}
                </div>
            )
        },
    },
    {
        accessorKey: "isPaid",
        header: "Payment",
        cell: ({ row }) => {
            const isPaid = row.getValue("isPaid") as boolean;
            return isPaid ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Paid
                </Badge>
            ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                    Unpaid
                </Badge>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Table Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            
            // Using existing status display logic, might need adjustments
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
                    case 'completed':
                        return {
                            icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
                            badge: <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center">Completed</Badge>
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
            const tableId = row.original.table._id;
            const orderIds = row.original.orders.map(o => o._id);
            const orderCount = row.original.orders.length;
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
                            <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-sm cursor-pointer" onSelect={(e) => e.preventDefault()}>
                                <ViewOrderButton tableId={tableId} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
