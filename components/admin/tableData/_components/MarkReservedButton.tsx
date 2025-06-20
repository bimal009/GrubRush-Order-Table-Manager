import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import CreateReservationForm from './createReservationForm'

const MarkReservedButton = ({ tableId }: { tableId: string }) => {
  const [open, setOpen] = useState(false)
  
  return (
    <CreateReservationForm 
      trigger={
        <Button variant='ghost' onClick={() => setOpen(true)}>
          <CalendarCheck className='mr-2 h-4 w-4 text-primary' /> Mark Reserved
        </Button>
      }
      onSuccess={() => setOpen(false)} 
    />
  )
}

export default MarkReservedButton