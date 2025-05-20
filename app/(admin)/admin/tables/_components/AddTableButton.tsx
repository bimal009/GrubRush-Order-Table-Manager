"use client"
import { CreateTableForm } from '@/components/admin/tableData/_components/createTableForm'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'

const AddTableButton = () => {
    const [open, setOpen] = useState(false)

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        onClick={() => setOpen(true)}
                        className="mt-2 sm:mt-0 shadow-md bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 text-base font-semibold rounded-md flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Table
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Add New Table</DialogTitle>
                    </DialogHeader>
                    <CreateTableForm onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddTableButton
