'use client'
import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import OrderCheckoutForm from './OrderCheckoutForm'
import { useOrderStore } from '@/lib/stores/orderStore'

const OrderCheckoutButton = ({ id }: { id: string }) => {
   const {orders}= useOrderStore()
   console.log(orders)
   
   // Calculate total number of items in cart
   const totalItems = orders.reduce((total, order) => total + order.quantity, 0)

  return (
    <div className='fixed bottom-8 right-8 z-50'>
      {/* Order count badge */}
      {totalItems > 0 && (
        <div className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold'>
          {totalItems}
        </div>
      )}
      
      <OrderCheckoutForm 
          tableId={id}
          trigger={
              <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 rounded-full shadow-lg flex items-center gap-2 px-6 py-3"
              >
                  <ShoppingCart size={20} />
                  <span>Checkout</span>
              </Button>
          }
      />
  </div>
  )
}

export default OrderCheckoutButton