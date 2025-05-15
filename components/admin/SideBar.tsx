'use client'

import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'
import Link from 'next/link'
import AdminNavitems from './AdminNavItems'

const SideBar = () => {
    return (
        <>
            {/* Mobile Sidebar - Sheet */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger
                        className="flex items-center justify-center p-2 rounded-md hover:bg-accent"
                        aria-label="Menu"
                    >
                        <Menu size={24} />
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col w-[250px]">
                        <SheetHeader className="mb-6">
                            <SheetTitle>
                                <Link href="/" className='flex items-center gap-2'>
                                    <Image className='w-8 h-8 object-contain' src="/logo.svg" alt="GrubRush logo" width={32} height={32} />
                                    <p className='text-xl font-bold'>GrubRush</p>
                                </Link>
                            </SheetTitle>
                        </SheetHeader>
                        <Separator className="mb-4" />
                        <AdminNavitems />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:flex-col md:w-[250px] md:h-screen md:border-r md:py-6 md:px-4">
                <Link href="/admin/dashboard" className='flex items-center gap-2 mb-6 px-2'>
                    <Image className='w-8 h-8 object-contain' src="/logo.svg" alt="GrubRush logo" width={32} height={32} />
                    <p className='text-xl font-bold'>GrubRush</p>
                </Link>
                <Separator className="mb-4" />
                <AdminNavitems />
            </aside>
        </>
    )
}

export default SideBar
