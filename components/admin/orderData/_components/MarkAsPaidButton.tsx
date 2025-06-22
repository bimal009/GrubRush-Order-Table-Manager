"use client"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { CircleDollarSign } from "lucide-react"
import { useMarkOrderAsPaid } from "../../api/useOrders"

const MarkAsPaidButton = ({ orderId }: { orderId: string }) => {
    const { mutate: markOrderAsPaid, isPending } = useMarkOrderAsPaid()

    const onClick = () => {
        markOrderAsPaid({ orderId }, {
            onSuccess: () => {
                toast.success("Order Paid", {
                    description: "The order has been marked as paid.",
                })
            },
            onError: (error) => {
                toast.error("Error", {
                    description: error.message || "Could not mark order as paid.",
                })
            }
        })
    }

    return (
        <Button
            variant='ghost'
            onClick={onClick}
            disabled={isPending}
            className="w-full justify-start p-0 h-auto font-normal bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 py-2"
        >
            <CircleDollarSign className='mr-2 h-4 w-4 text-green-600' />
            {isPending ? "Processing..." : "Mark as Paid"}
        </Button>
    )
}

export default MarkAsPaidButton 
