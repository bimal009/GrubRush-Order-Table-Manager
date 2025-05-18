import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import React from 'react'
import { useDeleteUser } from '../api/useUsers'

const HandleDeleteButton = ({ clerkId }: { clerkId: string }) => {
    const { mutateAsync: deleteUser } = useDeleteUser(clerkId)
    return (
        <div className='flex items-center justify-center'>
            <Button variant="destructive" size="sm" onClick={() => deleteUser(clerkId)}>
                <Trash2 className='w-4 h-4 text-white' /> Delete User
            </Button>
        </div>
    )
}

export default HandleDeleteButton
