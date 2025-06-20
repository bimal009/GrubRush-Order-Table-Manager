import OrderDetailsPage from '@/components/admin/tableData/_components/orderDetailsModal'
import React from 'react'

const page = () => {
  return (
    <div className='min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex flex-col gap-6 bg-background'>
        <OrderDetailsPage/>
    </div>
  )
}

export default page