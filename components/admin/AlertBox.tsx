import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React from "react"

interface AlertBoxProps {
    open: boolean
    setOpen: (open: boolean) => void
    title: string
    description: string
    action: string
    cancel: string
    openTrigger: React.ReactNode
    onAction?: () => void
    loading?: boolean
}

const AlertBox = ({
    open,
    setOpen,
    title,
    description,
    action,
    cancel,
    openTrigger,
    onAction,
    loading = false,
}: AlertBoxProps) => {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild aria-disabled={loading}>
                {openTrigger}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={loading}
                        aria-label={cancel}
                    >
                        {cancel}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            if (onAction) onAction()
                        }}
                        disabled={loading}
                        aria-label={action}
                    >
                        {loading ? "Processing..." : action}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertBox