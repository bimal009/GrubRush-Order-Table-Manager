import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
    return (
        <div className='flex justify-center items-center w-full h-screen'>
            <SignIn />
        </div>
    )
}

export default page
