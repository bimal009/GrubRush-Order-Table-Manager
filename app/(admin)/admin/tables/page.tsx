import { columns } from '@/components/admin/tableData/columns'
import { TableManagement } from '@/components/admin/tableData/columns'
import DataTable from '@/components/admin/tableData/DataTable'
import { Table2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

const tables: TableManagement[] = [
    {
        tableNo: 1,
        isAvailable: true,
        tableStatus: "available",
        orderStatus: "pending",
        amount: 0
    },
    {
        tableNo: 2,
        isAvailable: true,
        tableStatus: "available",
        orderStatus: "processing",
        amount: 0
    },
]

const page = () => {
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
                    <Button className="mt-2 sm:mt-0 shadow-md bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 text-base font-semibold rounded-md flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Add Table
                    </Button>
                </div>
                {/* Table Section */}
                <div className="rounded-2xl border bg-card shadow-lg p-0 sm:p-2 w-full overflow-x-visible">
                    <DataTable type="table" columns={columns} data={tables} />
                </div>
            </div>
        </div>
    )
}

export default page
