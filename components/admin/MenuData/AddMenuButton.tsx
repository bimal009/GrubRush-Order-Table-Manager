"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import CreateMenuItemForm from './CreateMenuForm'

const AddMenuButton = () => {
    return (
        <CreateMenuItemForm
            trigger={
                <Button className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600">
                    <PlusCircle className="w-5 h-5" />
                    <span>Add Menu Item</span>
                </Button>
            }
        />
    )
}

export default AddMenuButton
