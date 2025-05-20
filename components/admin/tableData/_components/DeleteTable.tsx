"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import AlertBox from "../../AlertBox"
import { toast } from "sonner"
import { useDeleteTable } from "../../api/useTable"

const DeleteTable = ({ tableId }: { tableId: string }) => {
    const [open, setOpen] = useState(false)
    const { mutate, isPending } = useDeleteTable()

    const handleDelete = () => {
        mutate(tableId, {
            onSuccess: () => {
                console.log("table deleted:", tableId)
                toast.success("Table deleted successfully")
                setOpen(false)
            },
            onError: (error) => {
                console.error("Delete error:", error)
                toast.error("Failed to delete Table. Please try again.")
                setOpen(false)
            },
        })
    }

    return (
        <AlertBox
            open={open}
            setOpen={setOpen}
            title="Confirm User Deletion"
            description="This action cannot be undone.ata will be permanently removed from our systems."
            action="Confirm Delete"
            cancel="Cancel"
            onAction={handleDelete}
            loading={isPending}
            openTrigger={
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 "
                    aria-label={isPending ? "Deleting user..." : "Delete user"}
                    disabled={isPending}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isPending ? "Deleting..." : "Delete Table"}
                </Button>
            }
        />
    )
}

export default DeleteTable