"use client"
import * as React from "react"
import { Search } from "lucide-react"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    SortingState,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    type: "table" | "user" | "menu" | "reservations" | "orders"
}

const DataTable = <TData, TValue>({
    columns,
    data,
    type
}: DataTableProps<TData, TValue>) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        }
    })

    const getFilterConfig = (type: string) => {
        switch (type) {
            case "user":
                return {
                    column: "username",
                    placeholder: "Search username..."
                }
            case "table":
                return {
                    column: "tableNumber",
                    placeholder: "Search table number..."
                }
            case "menu":
                return {
                    column: "name",
                    placeholder: "Search menu item..."
                }
            case "reservations":
                return {
                    column: "guestInfo.name",
                    placeholder: "Search guest name..."
                }
            case "orders":
                return {
                    column: "_id",
                    placeholder: "Search order ID..."
                }
            default:
                return {
                    column: "name",
                    placeholder: "Search..."
                }
        }
    }

    const filterConfig = getFilterConfig(type)

    return (
        <div className="w-full">
            {/* Search Input */}
            <div className="flex items-center py-4 px-2 sm:px-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={filterConfig.placeholder}
                        value={(table.getColumn(filterConfig.column)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(filterConfig.column)?.setFilterValue(event.target.value)
                        }
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <Table className="w-full table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="bg-muted/50 min-w-[120px]">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-muted/50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="min-w-[120px]">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-4 gap-2">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} {type}(s) total
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-8"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-8"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DataTable