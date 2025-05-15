import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import Navitems from './client/shared/Navitems'
import MobileNav from './client/shared/MobileNav'


const Header = () => {
    return (
        <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur'>
            <div className='container flex h-16 px-4  mx-auto items-center justify-between'>
                {/* Logo */}
                <div className='flex items-center gap-2'>
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.svg"
                            alt="Buntly logo"
                            width={200}
                            height={200}
                            className='h-20 w-20 object-contain'
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <SignedIn>
                    <nav className='hidden md:flex md:flex-1 md:justify-center'>
                        <Navitems />
                    </nav>
                </SignedIn>

                {/* Sign In / User Options */}
                <div className='flex items-center gap-4'>
                    <SignedOut>
                        <Link href="/sign-up">
                            <Button className='bg-primary text-primary-foreground rounded-full'>
                                Sign Up
                            </Button>
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                        <MobileNav />
                    </SignedIn>
                </div>
            </div>
        </header>
    )
}

export default Header