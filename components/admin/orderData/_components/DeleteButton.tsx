"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import AlertBox from "../../AlertBox"
import { toast } from "sonner"
import { useDeleteOrder } from "../../api/useOrders"

const DeleteButton = ({ tableId }: { tableId: string }) => {
    const [open, setOpen] = useState(false)
    const { mutate, isPending } = useDeleteOrder()

    const handleDelete = () => {
        mutate(tableId, {
            onSuccess: () => {
                toast.success("Order deleted successfully")
                setOpen(false)
            },
            onError: (error) => {
                console.error("Delete error:", error)
                toast.error("Failed to delete order. Please try again.")
                setOpen(false)
            },
        })
    }

    return (
        <AlertBox
            open={open}
            setOpen={setOpen}
            title="Confirm Order Deletion"
            description="This action cannot be undone. Order data will be permanently removed from our systems."
            action="Confirm Delete"
            cancel="Cancel"
            onAction={handleDelete}
            loading={isPending}
            openTrigger={
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 "
                    aria-label={isPending ? "Deleting order..." : "Delete order"}
                    disabled={isPending}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isPending ? "Deleting..." : "Delete Order"}
                </Button>
            }
        />
    )
}

export default DeleteButton