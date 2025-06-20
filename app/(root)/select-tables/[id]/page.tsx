import Menu from '@/components/client/menu'
import OrderCheckoutForm from '@/components/client/OrderCheckoutForm'
import { Button } from '@/components/ui/button'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    return (
        <div className='flex flex-col items-center justify-center'>
            <h1 className='text-2xl text-center font-bold  mt-10'>Select Food For your Table</h1>
            <Menu/>
            <OrderCheckoutForm 
                tableId={id}
                trigger={
                    <Button className="mt-4 bg-green-600 hover:bg-green-700">
                        Open Order Checkout
                    </Button>
                }
            />
        </div>
    )
}

export default page