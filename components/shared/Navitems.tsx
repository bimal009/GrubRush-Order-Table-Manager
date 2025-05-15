import Link from 'next/link'
import React from 'react'

const Navigations = [
    {
        label: 'Home',
        href: '/',
    },
    {
        label: 'Order Now',
        href: '/events/create',
    },
    {
        label: 'About Us',
        href: '/about',
    },
]

const Navitems = () => {
    return (
        <ul className='flex flex-col md:flex-row md:items-center md:gap-8 gap-6 px-4'>
            {Navigations.map((item) => (
                <li key={item.href}>
                    <Link href={item.href} className="hover:text-primary transition-colors">
                        {item.label}
                    </Link>
                </li>
            ))}

        </ul>
    )
}

export default Navitems
