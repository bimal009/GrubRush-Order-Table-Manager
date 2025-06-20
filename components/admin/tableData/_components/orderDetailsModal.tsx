"use client"
import React from 'react';
import { ArrowLeft, Clock, User, Phone, Mail, MapPin, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const OrderDetailsPage = () => {

  const router = useRouter();
  // Mock order data
  const order = {
    id: "ORD-2024-001",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+1 (555) 123-4567",
    tableNumber: 5,
    orderType: "dine-in",
    paymentMethod: "card",
    isPaid: true,
    isCompleted: false,
    status: "preparing",
    specialInstructions: "Extra spicy, no onions",
    createdAt: "2024-06-20T14:30:00Z",
    items: [
      {
        id: 1,
        name: "Margherita Pizza",
        quantity: 2,
        unitPrice: 18.99,
        totalPrice: 37.98,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop"
      },
      {
        id: 2,
        name: "Caesar Salad",
        quantity: 1,
        unitPrice: 12.50,
        totalPrice: 12.50,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop"
      },
      {
        id: 3,
        name: "Garlic Bread",
        quantity: 1,
        unitPrice: 6.99,
        totalPrice: 6.99,
        image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop"
      }
    ],
    subtotal: 57.47,
    tax: 5.75,
    totalAmount: 63.22
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'served': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'preparing': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.id}</p>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-2 capitalize">{order.status}</span>
            </div>
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
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">${item.unitPrice.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-gray-900">${item.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${order.totalAmount.toFixed(2)}</span>
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
                <h2 className="text-xl font-semibold text-gray-900">Customer Info</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600 text-sm">{order.customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600 text-sm">{order.customerEmail}</p>
                  </div>
                </div>
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
                  <span className="text-gray-900 font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block">Table Number</span>
                  <span className="text-gray-900 font-medium">#{order.tableNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block">Order Type</span>
                  <span className="text-gray-900 font-medium capitalize">{order.orderType.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block">Payment Method</span>
                  <span className="text-gray-900 font-medium capitalize">{order.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block">Payment Status</span>
                  <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 text-sm block">Order Status</span>
                  <span className={`font-medium ${order.isCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                    {order.isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions & Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Special Instructions */}
              {order.specialInstructions && (
                <div className="bg-white rounded-lg shadow-sm border h-fit">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Special Instructions</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700">{order.specialInstructions}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white rounded-lg shadow-sm border h-fit">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Actions</h2>
                </div>
                <div className="p-6 space-y-3">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Update Status
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Edit Order
                  </button>
                  <button className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium">
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;