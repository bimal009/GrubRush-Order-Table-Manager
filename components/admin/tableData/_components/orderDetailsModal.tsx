"use client"
import React, { useState } from 'react';
import { ArrowLeft, Clock, User, Mail, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useGetTableById, useGetOrdersByTable, useUpdateOrderStatus } from '../../api/useOrders';
import { useAuth } from '@clerk/nextjs';
import MarkAsPaidButton from '../../orderData/_components/MarkAsPaidButton';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { SerializedOrder } from '../../orderData/_components/columns';

const OrderDetailsPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { userId } = useAuth();

    const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

    const tableId = id as string;

    const { data: ordersResponse, isLoading: ordersLoading, error: ordersError } = useGetOrdersByTable(tableId);
    const { data: table, isLoading: tableLoading, error: tableError } = useGetTableById(tableId);
    const { mutateAsync: updateOrderStatusMutation } = useUpdateOrderStatus();

    // Filter orders to only today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isSerializedOrder = (order: any): order is SerializedOrder => !!order && typeof order._id === 'string' && !!order.createdAt;
    const orders: SerializedOrder[] = (ordersResponse?.data || [])
        .filter(order => order != null)
        .filter(isSerializedOrder)
        .filter((order: SerializedOrder) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= today && orderDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        });

    const statusOptions = ['pending', 'preparing', 'served'];

    const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
        const currentIdx = statusOptions.indexOf(currentStatus);
        const nextStatus = statusOptions[(currentIdx + 1) % statusOptions.length];
        setStatusUpdating(orderId);
        try {
            await updateOrderStatusMutation({ orderId, status: nextStatus });
            toast.success('Order status updated.');
        } catch (error) {
            toast.error('Failed to update status.');
        } finally {
            setStatusUpdating(null);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        setIsCancelling(true);
        try {
            await updateOrderStatusMutation({ orderId, status: 'cancelled' });
            setShowCancelConfirm(null);
            toast.success('Order has been cancelled.');
        } catch (error) {
            toast.error('Failed to cancel order.');
        } finally {
            setIsCancelling(false);
        }
    };

    if (ordersLoading || tableLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (ordersError || tableError || !table) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900">Error Loading Details</h2>
                    <p className="text-gray-600 mb-4">Unable to load table details. Please try again.</p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'served': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <AlertCircle className="w-4 h-4" />;
            case 'preparing': return <Clock className="w-4 h-4" />;
            case 'served': return <CheckCircle className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const subtotal = orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);
    const tax = subtotal * 0.1;
    const totalAmount = subtotal + tax;

    return (
        <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
                <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Table Orders
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Orders for Table #{table?.tableNumber}</h1>
                <p className="text-gray-600 mt-1">Showing today's orders for this table.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content: Order list and summary */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="p-4 sm:p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Today's Orders ({orders.length})
                            </h2>
                        </div>
                        {/* Order List */}
                        <div className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <div key={order._id} className="p-4 flex flex-col sm:flex-row items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">Order #{order._id.slice(-6)}</h3>
                                        {order.orderItems?.map((item: any, index: number) => (
                                            <div key={index} className="text-sm text-gray-600 ml-4 mt-1">
                                                <span>• {item.name} (x{item.quantity})</span>
                                                {item.specialInstructions && <span className="italic"> - "{item.specialInstructions}"</span>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}> 
                                            {getStatusIcon(order.status)}
                                            <span className="ml-2 capitalize">{order.status}</span>
                                        </div>
                                        <Button
                                            onClick={() => handleStatusUpdate(order._id, order.status)}
                                            disabled={order.status === 'served' || order.status === 'cancelled' || statusUpdating === order._id}
                                            variant="outline"
                                            size="sm"
                                        >
                                            {statusUpdating === order._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Status'}
                                        </Button>
                                        {!order.isPaid ? (
                                            <MarkAsPaidButton orderId={order._id} />
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm text-green-600 py-2 px-3 rounded-lg bg-green-50">
                                                <CheckCircle className="w-4 h-4" /> Paid
                                            </div>
                                        )}
                                        {order.status !== 'cancelled' && order.status !== 'served' && (
                                            <Button onClick={() => setShowCancelConfirm(order._id)} variant="destructive" size="sm">Cancel</Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Order Summary */}
                        <div className="p-6 border-t">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-sm text-gray-600"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
                                <div className="flex justify-between text-lg font-semibold text-gray-900"><span>Total</span><span>${totalAmount.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Side panel: Customer info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Customer Info */}
                    {orders[0]?.buyer && (
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-6 border-b"><h2 className="text-xl font-semibold text-gray-900">Customer Info</h2></div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900">{orders[0].buyer.firstName} {orders[0].buyer.lastName}</p>
                                        <p className="text-sm text-gray-600">@{orders[0].buyer.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <p className="text-sm text-gray-600">{orders[0].buyer.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
                        <p className="text-gray-600 my-4">Are you sure? This cannot be undone.</p>
                        <div className="flex gap-3">
                            <Button onClick={() => setShowCancelConfirm(null)} variant="outline" className="flex-1">Keep Order</Button>
                            <Button onClick={() => { if (showCancelConfirm) handleCancelOrder(showCancelConfirm) }} disabled={isCancelling} className="flex-1">
                                {isCancelling ? <Loader2 className="animate-spin" /> : 'Confirm Cancel'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetailsPage;