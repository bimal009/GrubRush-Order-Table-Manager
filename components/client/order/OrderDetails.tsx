import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, User, Mail, CheckCircle, XCircle, AlertCircle, Loader2, ChevronDown, Package, DollarSign, Calendar, Hash } from 'lucide-react';
import { useGetTableById } from '@/components/admin/api/useTable';
import { useGetOrdersByTable } from '@/components/admin/api/useOrders';
import { useParams } from 'next/navigation';


const OrderDetailsPage = () => {
  const { id } = useParams();
  const tableId = id as string;
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const { data: ordersResponse, isLoading: ordersLoading, error: ordersError } = useGetOrdersByTable(tableId);
  const { data: table, isLoading: tableLoading, error: tableError } = useGetTableById(tableId);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'preparing', label: 'Preparing', color: 'blue' },
    { value: 'served', label: 'Served', color: 'green' }
  ];

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o._id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) return;
    console.log(`Bulk action: ${action} for orders:`, selectedOrders);
    setSelectedOrders([]);
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    console.log(`Update order ${orderId} to ${newStatus}`);
    setIsStatusDropdownOpen(prev => ({ ...prev, [orderId]: false }));
  };

  const handleCancelOrder = (orderId) => {
    setIsCancelling(true);
    setTimeout(() => {
      console.log(`Cancel order ${orderId}`);
      setShowCancelConfirm(null);
      setIsCancelling(false);
    }, 1500);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      preparing: 'bg-blue-50 text-blue-700 border-blue-200',
      served: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      preparing: <Package className="w-4 h-4" />,
      served: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const subtotal = orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);
  const tax = subtotal * 0.1;
  const totalAmount = subtotal + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => console.log('Go back')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Hash className="w-6 h-6 mr-2 text-blue-600" />
                  Table {table?.tableNumber}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'} • 
                  Last updated {formatTime(new Date().toISOString())}
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'preparing').length}</div>
                <div className="text-xs text-gray-500">Preparing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.isPaid).length}</div>
                <div className="text-xs text-gray-500">Paid</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Orders Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Orders Header with Selection */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="selectAll"
                        checked={selectedOrders.length === orders.length && orders.length > 0}
                        onChange={handleSelectAll}
                        disabled={orders.length === 0}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="selectAll" className="text-sm font-medium text-gray-700">
                        Select All
                      </label>
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedOrders.length > 0 && `${selectedOrders.length} selected`}
                    </div>
                  </div>
                  
                  <div className="text-lg font-semibold text-gray-900">
                    Orders ({orders.length})
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      {/* Selection Checkbox */}
                      <div className="lg:col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => handleSelectOrder(order._id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>

                      {/* Order Info */}
                      <div className="lg:col-span-5">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            Order #{order._id.slice(-6)}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatTime(order.createdAt)}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {order.orderItems?.map((item, index) => (
                            <div key={index} className="text-sm text-gray-600 flex items-center">
                              <span className="w-2 h-2 bg-gray-300 rounded-full mr-2 flex-shrink-0"></span>
                              <span className="font-medium">{item.name}</span>
                              <span className="mx-2">×{item.quantity}</span>
                              {item.specialInstructions && (
                                <span className="italic text-gray-500 text-xs">
                                  "{item.specialInstructions}"
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="lg:col-span-2">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status}</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="lg:col-span-2">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ${order.totalAmount}
                          </div>
                          <div className={`text-xs font-medium ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-2">
                        <div className="flex flex-col space-y-2">
                          {/* Status Update Dropdown */}
                          {order.status !== 'served' && order.status !== 'cancelled' && (
                            <div className="relative">
                              <button
                                onClick={() => setIsStatusDropdownOpen(prev => ({ 
                                  ...prev, 
                                  [order._id]: !prev[order._id] 
                                }))}
                                className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                              >
                                Update Status
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              
                              {isStatusDropdownOpen[order._id] && (
                                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                  {statusOptions.map((option) => (
                                    <button
                                      key={option.value}
                                      onClick={() => handleStatusUpdate(order._id, option.value)}
                                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                        option.value === order.status ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                      }`}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Payment Status */}
                          {!order.isPaid ? (
                            <button className="w-full px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                              Mark as Paid
                            </button>
                          ) : (
                            <div className="flex items-center justify-center px-3 py-1.5 text-xs text-green-700 bg-green-50 rounded-md">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid
                            </div>
                          )}

                          {/* Cancel Button */}
                          {order.status !== 'cancelled' && order.status !== 'served' && (
                            <button
                              onClick={() => setShowCancelConfirm(order._id)}
                              className="w-full px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 max-w-md ml-auto">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2 flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bulk Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Bulk Actions</h3>
                <p className="text-xs text-gray-500 mt-1">{selectedOrders.length} orders selected</p>
              </div>
              <div className="p-4 space-y-3">
                <button
                  onClick={() => handleBulkAction('mark-paid')}
                  disabled={selectedOrders.length === 0}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Mark as Paid
                </button>
                <button
                  onClick={() => handleBulkAction('preparing')}
                  disabled={selectedOrders.length === 0}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <Package className="w-4 h-4 inline mr-2" />
                  Set Preparing
                </button>
                <button
                  onClick={() => handleBulkAction('served')}
                  disabled={selectedOrders.length === 0}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Mark Served
                </button>
                <button
                  onClick={() => handleBulkAction('cancel')}
                  disabled={selectedOrders.length === 0}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <XCircle className="w-4 h-4 inline mr-2" />
                  Cancel Selected
                </button>
              </div>
            </div>

            {/* Customer Info */}
            {orders[0]?.buyer && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Info</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {orders[0].buyer.firstName} {orders[0].buyer.lastName}
                      </p>
                      <p className="text-sm text-gray-600">@{orders[0].buyer.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">{orders[0].buyer.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Order</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={() => handleCancelOrder(showCancelConfirm)}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {isCancelling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Confirm Cancel'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;