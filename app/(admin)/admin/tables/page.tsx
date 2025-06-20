"use client"
import { columns } from '@/components/admin/tableData/_components/columns'
import DataTable from '@/components/admin/tableData/DataTable'
import { Table2 } from 'lucide-react'
import React from 'react'
import AddTableButton from './_components/AddTableButton'
import { useGetTables } from '@/components/admin/api/useTable'



const TablePage = () => {
    const { data: hotelTableData } = useGetTables()
    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-muted/50 py-8">
            <div className="w-full px-2 sm:px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Table2 className="w-6 h-6 text-orange-500" />
                            Table Management
                        </h1>
                        <p className="text-base text-muted-foreground mt-1">
                            Manage and monitor your restaurant tables
                        </p>
                    </div>

                    <AddTableButton />
                </div>
                {/* Table Section */}
                <div className="rounded-2xl border bg-card shadow-lg p-0 sm:p-2 w-full overflow-x-visible">
                    <DataTable type="table" columns={columns} data={hotelTableData ?? []} />
                </div>
            </div>
        </div>
    )
}

export default TablePage
