"use client"

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash, Eye, CheckCircle, XCircle } from 'lucide-react'
import { useDeleteMenu, useToggleAvailability } from '../api/useMenu'
import CreateMenuForm from './CreateMenuForm'
import { MenuItem } from '@/types'

interface ActionDropdownProps {
    id: string;
    name: string;
    menuItem: MenuItem;
}

const ActionDropdown = ({ id, name, menuItem }: ActionDropdownProps) => {
    const { mutate: deleteMenu, isPending: isDeleting } = useDeleteMenu()
    const { mutate: toggleAvailability, isPending: isToggling } = useToggleAvailability()
    
    const handleDelete = () => {
        deleteMenu({ id })
    };

    const handleToggleAvailability = (isAvailable: boolean) => {
        toggleAvailability({ id, isAvailable })
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs">Menu Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="text-sm cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                    className="text-sm cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                >
                    <CreateMenuForm
                        menuItem={menuItem}
                        trigger={
                            <div className="flex items-center w-full">
                                <Edit className="mr-2 h-4 w-4" />
                                <span className="text-sm ml-2">Edit Item</span>
                            </div>
                        }
                    />
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {!menuItem.isAvailable ? (
                    <DropdownMenuItem 
                        className="text-sm cursor-pointer text-green-600 focus:text-green-700"
                        onClick={() => handleToggleAvailability(true)}
                        disabled={isToggling}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {isToggling ? "Marking..." : "Mark as Available"}
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem 
                        className="text-sm cursor-pointer text-red-600 focus:text-red-700"
                        onClick={() => handleToggleAvailability(false)}
                        disabled={isToggling}
                    >
                        <XCircle className="mr-2 h-4 w-4" />
                        {isToggling ? "Marking..." : "Mark as Unavailable"}
                    </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            className="text-sm cursor-pointer text-red-600 focus:text-red-700"
                            onSelect={(e) => e.preventDefault()}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Item
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete "{name}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ActionDropdown 