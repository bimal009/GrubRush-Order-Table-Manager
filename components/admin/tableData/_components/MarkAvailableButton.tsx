import { Button } from '@/components/ui/button'
import React from 'react'
import { useMarkAvailable, useMarkUnavailable } from '@/components/admin/api/useTable'
import { Check, X } from 'lucide-react'
import { useGetTables } from '../../api/useTable'

const MarkAvailableButton = ({ tableId }: { tableId: string }) => {
  const { data: tables } = useGetTables()
  const { mutate: markAvailable, isPending: isMarkingAvailable } = useMarkAvailable()
  const { mutate: markUnavailable, isPending: isMarkingUnavailable } = useMarkUnavailable()

  // Find the current table
  const currentTable = tables?.find((table) => table._id === tableId)
  
  // If we don't have table data yet, show a loading state or return null
  if (!tables || !currentTable) {
    return null // or a loading spinner
  }

  const isAvailable = currentTable.isAvailable
  const isLoading = isMarkingAvailable || isMarkingUnavailable

  // If table is currently unavailable, show "Mark Available" button
  if (!isAvailable) {
    return (
      <Button 
        variant='ghost' 
        onClick={() => markAvailable(tableId)} 
        disabled={isLoading}
      >
        <Check className='mr-2 h-4 w-4 text-green-600' /> 
        {isMarkingAvailable ? "Marking..." : "Mark Available"}
      </Button>
    )
  }

  // If table is currently available, show "Mark Unavailable" button
  return (
    <Button 
      variant='ghost' 
      onClick={() => markUnavailable(tableId)} 
      disabled={isLoading}
    >
      <X className='mr-2 h-4 w-4 text-red-600' /> 
      {isMarkingUnavailable ? "Marking..." : "Mark Unavailable"}
    </Button>
  )
}

export default MarkAvailableButton