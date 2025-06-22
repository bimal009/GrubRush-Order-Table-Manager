import { Button } from '@/components/ui/button'
import React from 'react'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ViewOrderButton = ({ tableId }: { tableId: string }) => {
  const router = useRouter()
  return (
    <div><Button variant='ghost' onClick={() => router.push(`/admin/orders/${tableId}`)}> <Eye className='mr-2 h-4 w-4 text-primary' /> View Order</Button></div>
  )
}

export default ViewOrderButton