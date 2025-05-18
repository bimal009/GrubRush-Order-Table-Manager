import { columns } from '@/components/admin/tableData/columns'
import DataTable from '@/components/admin/tableData/DataTable'
import { Table2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { HotelTable } from '@/components/admin/tableData/columns'

export const hotelTableData: HotelTable[] = [
    {
        _id: "1",
        tableNumber: 1,
        capacity: 4,
        location: "indoor",
        isAvailable: true,
        isReserved: false,
        isPaid: true,
        status: "completed",
        estimatedServeTime: "2025-05-18T19:30:00Z",
    },
    {
        _id: "2",
        tableNumber: 2,
        capacity: 2,
        location: "outdoor",
        isAvailable: false,
        isReserved: true,
        isPaid: false,
        status: "processing",
        estimatedServeTime: "2025-05-18T20:00:00Z",
    },
    {
        _id: "3",
        tableNumber: 3,
        capacity: 6,
        location: "indoor",
        isAvailable: true,
        isReserved: false,
        isPaid: false,
        status: "idle",
        estimatedServeTime: null,
    },
    {
        _id: "4",
        tableNumber: 4,
        capacity: 8,
        location: "outdoor",
        isAvailable: false,
        isReserved: true,
        isPaid: true,
        status: "completed",
        estimatedServeTime: "2025-05-18T21:15:00Z",
    },
    {
        _id: "5",
        tableNumber: 5,
        capacity: 2,
        location: "indoor",
        isAvailable: true,
        isReserved: false,
        isPaid: true,
        status: "processing",
        estimatedServeTime: "2025-05-18T20:45:00Z",
    },
];


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
                    <DataTable type="table" columns={columns} data={hotelTableData} />
                </div>
            </div>
        </div>
    )
}

export default page
