import { Button } from '@/components/ui/button'
import React from 'react'
import { useMarkAvailable } from '../../api/useTable'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

const MarkAvailableButton = ({ tableId }: { tableId: string }) => {
  const router = useRouter()
  return (
    <div><Button variant='ghost' onClick={() => router.push(`/admin/orders/${tableId}`)}> <Check className='mr-2 h-4 w-4 text-primary' /> View Orders</Button></div>
  )
}

export default MarkAvailableButton