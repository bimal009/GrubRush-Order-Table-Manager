import { Button } from '@/components/ui/button'
import React from 'react'
import { Check, Clock } from 'lucide-react'
import {  useUpdateOrderStatus } from '../../api/useOrders'
import { toast } from 'sonner'

const MarkCompletedButton = ({ tableId }: { tableId: string }) => {
  const { mutate: updateOrderStatus, isPending } = useUpdateOrderStatus()

  const handleMarkCompleted = () => {
    // Set estimatedServeTime to current time to mark as completed
    const currentTime = Date.now()
    
    updateOrderStatus({
      orderId: tableId,
      status: 'served'
    }, {
      onSuccess: () => {
        toast.success("Order marked as completed")
      },
      onError: (error) => {
        console.error("Error updating order:", error)
        toast.error("Failed to update order status")
      }
    })
  }

  return (
    <Button 
      variant='ghost' 
      onClick={handleMarkCompleted} 
      disabled={isPending}
    >
      <Check className='mr-2 h-4 w-4 text-green-600' /> 
      {isPending ? "Updating..." : "Mark served"}
    </Button>
  )
}

export default MarkCompletedButton