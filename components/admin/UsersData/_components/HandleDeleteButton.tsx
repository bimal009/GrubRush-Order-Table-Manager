"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useDeleteUser } from "../../api/useUsers"
import AlertBox from "../../AlertBox"
import { toast } from "sonner"

const HandleDeleteButton = ({ clerkId }: { clerkId: string }) => {
    const [open, setOpen] = useState(false)
    const { mutate, isPending } = useDeleteUser()

    const handleDelete = () => {
        mutate(clerkId, {
            onSuccess: () => {
                toast.success("User deleted successfully")
                setOpen(false)
            },
            onError: (error) => {
                console.error("Delete error:", error)
                toast.error("Failed to delete user. Please try again.")
                setOpen(false)
            },
        })
    }

    return (
        <AlertBox
            open={open}
            setOpen={setOpen}
            title="Confirm User Deletion"
            description="This action cannot be undone. All user data will be permanently removed from our systems."
            action="Confirm Delete"
            cancel="Cancel"
            onAction={handleDelete}
            loading={isPending}
            openTrigger={
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    aria-label={isPending ? "Deleting user..." : "Delete user"}
                    disabled={isPending}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isPending ? "Deleting..." : "Delete User"}
                </Button>
            }
        />
    )
}

export default HandleDeleteButton