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
import Navitems from './Navitems'
import Link from 'next/link'

const MobileNav = () => {
    return (
        <div className='md:hidden'>
            <Sheet>
                <SheetTrigger className="flex items-center justify-center p-2 rounded-md hover:bg-accent" aria-label="Menu">
                    <Menu size={24} />
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <SheetHeader className="mb-6">
                        <SheetTitle>
                            <Link href="/" className='flex items-center gap-2'>
                                <Image className='w-8 h-8 object-contain' src="/logo.svg" alt="Buntly logo" width={32} height={32} />
                                <p className='text-xl font-bold'>GrubRush</p>
                            </Link>
                        </SheetTitle>

                    </SheetHeader>
                    <div className="mb-4">
                        <p className='text-sm text-muted-foreground mb-2 px-4'>Quick Links</p>
                        <Separator className="mb-4" />
                        <Navitems />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileNav