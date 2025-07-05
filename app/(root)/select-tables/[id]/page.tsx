
import Menu from '@/components/client/menu'
import OrderCheckoutButton from '@/components/client/orderCheckoutButton'


const page = async ({ params }: { params: Promise<{ id: string }> }) => {
   const {id}= await params
   if(!id){
    window.location.href = '/select-tables'
   }
   
    return (
        <div className='flex flex-col items-center justify-center relative'>
            <h1 className='text-2xl text-center font-bold mt-10'>Select Food For your Table</h1>
            <Menu/>
            <OrderCheckoutButton id={id} />
        </div>
    )
}

export default page