"use client"
import React, { useState } from 'react';
import { ArrowLeft, Clock, User, Phone, Mail, MapPin, CreditCard, CheckCircle, XCircle, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useGetOrderById } from '@/components/client/api/useOrder';
import { useGetTableById, useGetOrdersByTable, useUpdateOrderStatus } from '../../api/useOrders';
import { useAuth } from '@clerk/nextjs';
import MarkAsPaidButton from '../../orderData/_components/MarkAsPaidButton';

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { userId } = useAuth();
  
  // State for status selector and cancel confirmation
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // The id parameter is actually the tableId in this context
  const tableId = id as string;
  console.log('Table ID from URL params:', tableId);
  
  
  const { data: ordersResponse, isLoading: ordersLoading, error: ordersError } = useGetOrdersByTable(tableId);
  const { data: table, isLoading: tableLoading, error: tableError } = useGetTableById(tableId);
  const {mutate:updateOrderStatusMutation, isPending } = useUpdateOrderStatus();

  
  // Extract data from responses
  const orders = ordersResponse?.data || [];
console.log(orders)

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'served', label: 'Served' }
  ];

  // Show loading state
  if (ordersLoading || tableLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 absolute top-0 left-0 flex items-center justify-center h-full w-full">
        <div className="text-center">
          <Loader2 className="w-6 h-6 text-primary mx-auto mb-4 animate-spin" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (ordersError || tableError || !table) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Order</h2>
          <p className="text-gray-600 mb-4">
            Unable to load table details. Please try again.
          </p>
          <button 
            onClick={() => router.back()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if user has permission to view this order
  const canViewOrder = () => {
    // Admin component - allow any authenticated user
    return !!userId;
  };

  // Show unauthorized access
  if (!canViewOrder()) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to view this order.
          </p>
          <button 
            onClick={() => router.back()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'served': return 'bg-purple-100 text-purple-800 border-purple-200';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: string) => {
    if (!orders[0]?._id) return;
    
    
    try {
      await updateOrderStatusMutation({ 
        orderId: orders[0]._id, 
        status: newStatus 
      });
      setIsStatusDropdownOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!orders[0]?._id) return;
    
    setIsCancelling(true);
    try {
      await updateOrderStatusMutation({ 
        orderId: orders[0]._id, 
        status: 'cancelled' 
      });
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  // Calculate totals from order items
  const subtotal = orders.reduce((sum: number, order: any) => sum + (parseFloat(order.totalAmount) || 0), 0) || 0;
  const tax = subtotal * 0.1; // 10% tax
  const totalAmount = subtotal + tax;

  // Determine view context for UI adjustments
  const isTableView = !!tableId;
  const viewContext = isTableView ? 'Table' : 'My';

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {isTableView ? 'Table Orders' : 'My Orders'}
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {viewContext} Order Details
              </h1>
              <p className="text-gray-600 mt-1">Order #{tableId}</p>
              {isTableView && (
                <p className="text-sm text-blue-600 mt-1">
                  Table #{table?.tableNumber} Order
                </p>
              )}
            </div>

            
            {/* Status Display/Selector */}
            {isTableView && orders[0]?.status !== 'cancelled' ? (
              <div className="relative flex justify-between gap-3 items-center">
              {!orders[0]?.isPaid ? (
                <div className="flex justify-center gap-2 rounded-lg">
                  <MarkAsPaidButton orderId={orders[0]._id} />
                </div>
                ) : (
                  <div className="flex justify-center gap-2 rounded-lg bg-green-100 py-2 px-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">Paid</span>
                  </div>
                )}
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  disabled={isPending || orders[0]?.status === 'served'}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(orders[0]?.status || 'pending')} hover:opacity-80 disabled:opacity-50 ${orders[0]?.status === 'served' ? 'cursor-not-allowed' : ''}`}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    getStatusIcon(orders[0]?.status || 'pending')
                  )}
                  <span className="ml-2 capitalize">{orders[0]?.status || 'pending'}</span>
                  {!isPending && orders[0]?.status !== 'served' && <ChevronDown className="w-4 h-4 ml-2" />}
                </button>
                
                {isStatusDropdownOpen && orders[0]?.status !== 'served' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusUpdate(option.value)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                          option.value === orders[0]?.status ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          {getStatusIcon(option.value)}
                          <span className="ml-2">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(orders[0]?.status || 'pending')}`}>
                {getStatusIcon(orders[0]?.status || 'pending')}
                <span className="ml-2 capitalize">{orders[0]?.status || 'pending'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-fit">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Order #{order._id}</h3>
                        <p className="text-sm text-gray-600">Items: {order.orderItems?.length || 0}</p>
                        <p className="text-sm text-gray-600">${(parseFloat(order.totalAmount) || 0).toFixed(2)} total</p>
                        {order.orderItems?.map((item: any, index: number) => (
                          <div key={index} className="ml-4 mt-2">
                            <p className="text-sm text-gray-600">• {item.name} x{item.quantity}</p>
                            {item.specialInstructions && (
                              <p className="text-sm text-gray-500 italic ml-2">"{item.specialInstructions}"</p>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-gray-900">${(parseFloat(order.totalAmount) || 0).toFixed(2)}</p>
                        <p className="text-sm text-gray-500 capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border h-fit">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isTableView ? 'Customer Info' : 'Your Info'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {orders[0]?.buyer?.firstName} {orders[0]?.buyer?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">@{orders[0]?.buyer?.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600 text-sm">{orders[0]?.buyer?.email}</p>
                  </div>
                </div>
                {orders[0]?.buyer?.photo && (
                  <div className="flex items-center space-x-3">
                    <img 
                      src={orders[0]?.buyer.photo} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Profile Photo</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border h-fit">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Order Info</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-gray-600 text-sm block">Order Date</span>
                  <span className="text-gray-900 font-medium">{formatDate(orders[0]?.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block">Table Number</span>
                  <span className="text-gray-900 font-medium">#{table?.tableNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block">Table Capacity</span>
                  <span className="text-gray-900 font-medium">{table?.capacity} people</span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block">Table Location</span>
                  <span className="text-gray-900 font-medium capitalize">{table?.location}</span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block">Table Status</span>
                  <span className="text-gray-900 font-medium capitalize">{table?.status}</span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block">Total Items</span>
                  <span className="text-gray-900 font-medium">{orders.length}</span>
                </div>
                {orders[0]?.estimatedServeTime && (
                  <div>
                    <span className="text-gray-600 text-sm block">Estimated Serve Time</span>
                    <span className="text-gray-900 font-medium">{orders[0]?.estimatedServeTime} minutes</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Special Instructions & Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Special Instructions */}
              {orders.some((order: any) => order.orderItems?.some((item: any) => item.specialInstructions)) && (
                <div className="bg-white rounded-lg shadow-sm border h-fit">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Special Instructions</h2>
                  </div>
                  <div className="p-6">
                    {orders.map((order: any) => (
                      order.orderItems?.map((item: any) => (
                        item.specialInstructions && (
                          <div key={`${order._id}-${item._id}`} className="mb-3">
                            <p className="font-medium text-sm text-gray-900">{item.name} (Order #{order._id}):</p>
                            <p className="text-gray-700 text-sm italic">"{item.specialInstructions}"</p>
                          </div>
                        )
                      ))
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white rounded-lg shadow-sm border h-fit">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Actions</h2>
                </div>
                <div className="p-6 space-y-3">
            
                  {isTableView ? (
                    <>
                      {orders[0]?.status !== 'cancelled' && orders[0]?.status !== 'served' && (
                        <button 
                          onClick={() => setShowCancelConfirm(true)}
                          className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium"
                        >
                          Cancel Order
                        </button>
                      )}
                      {orders[0]?.status === 'served' && (
                        <div className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-lg font-medium text-center">
                          Order Completed - No Actions Available
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <button 
                        disabled={orders[0]?.status === 'served'}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          orders[0]?.status === 'served' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        Reorder Items
                      </button>
                      <button 
                        disabled={orders[0]?.status === 'served'}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          orders[0]?.status === 'served' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Contact Support
                      </button>
                      {orders[0]?.status === 'pending' && (
                        <button 
                          onClick={() => setShowCancelConfirm(true)}
                          className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium"
                        >
                          Cancel Order
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {isCancelling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Cancel Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isStatusDropdownOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsStatusDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderDetailsPage;