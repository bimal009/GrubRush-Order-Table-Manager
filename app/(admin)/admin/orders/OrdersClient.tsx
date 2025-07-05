"use client"
import { GroupedOrder, columns } from '@/components/admin/orderData/_components/columns'
import DataTable from '@/components/admin/orderData/DataTable'
import { Loader2, Table2 } from 'lucide-react'
import React from 'react'
import { useGetOrders } from '@/components/admin/api/useOrders'
import { SerializedOrder } from '@/components/admin/orderData/_components/columns'



const OrdersClient = () => {
    const { data: ordersData, isLoading } = useGetOrders()

    const groupedOrders = React.useMemo(() => {
        if (!ordersData?.data?.orders) return [];

        const orders = ordersData.data.orders.filter(Boolean) as SerializedOrder[];

        const grouped = orders.reduce((acc, order) => {
            if (!order.table) {
                return acc;
            }
            const tableId = order.table._id;

            if (!acc[tableId]) {
                acc[tableId] = {
                    _id: tableId,
                    table: order.table,
                    orders: [],
                    totalOrders: 0,
                    totalAmount: 0,
                    status: 'completed',
                    isPaid: true
                };
            }
            
            acc[tableId].orders.push(order);
            acc[tableId].totalOrders += 1;
            acc[tableId].totalAmount += parseFloat(order.totalAmount) || 0;
            if(!order.isPaid){
                acc[tableId].isPaid = false;
            }

            if (order.status !== 'completed' && acc[tableId].status === 'completed') {
                acc[tableId].status = order.status;
            } else if (order.status === 'preparing' && acc[tableId].status !== 'pending') {
                 acc[tableId].status = 'preparing';
            } else if (order.status === 'pending') {
                acc[tableId].status = 'pending';
            }

            return acc;
        }, {} as Record<string, GroupedOrder>);

        return Object.values(grouped);
    }, [ordersData]);


    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] w-full bg-muted/50 py-8">
                <div className="fixed inset-0 flex justify-center items-center bg-background/80 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-muted/50 py-8">
            <div className="w-full px-2 sm:px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Table2 className="w-6 h-6 text-orange-500" />
                            Order Management
                        </h1>
                        <p className="text-base text-muted-foreground mt-1">
                            Manage and monitor your restaurant orders
                        </p>
                    </div>
                    
                </div>
                {/* Table Section */}
                <div className="rounded-2xl border bg-card shadow-lg p-0 sm:p-2 w-full overflow-x-visible">
                    <DataTable type="grouped-orders" columns={columns} data={groupedOrders} />
                </div>
            </div>
        </div>
    )
}

export default OrdersClient
