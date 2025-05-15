import Link from 'next/link'
import React from 'react'

const Navigations = [
    {
        label: 'dashboard',
        href: '/admin/dashboard',
    },
    {
        label: 'Manage Orders',
        href: '/admin/orders',
    },
    {
        label: 'Manage Menu',
        href: '/admin/menu',
    },
    {
        label: 'Total Sales',
        href: '/admin/sales',
    },
]

const AdminNavitems = () => {
    return (
        <ul className='flex flex-col  md:gap-8 gap-6 px-4'>
            {Navigations.map((item) => (
                <li key={item.href} className="text-md font-medium text-muted-foreground hover:text-primary transition-colors">
                    <Link href={item.href} className="hover:text-primary transition-colors">
                        {item.label}
                    </Link>
                </li>
            ))}

        </ul>
    )
}

export default AdminNavitems;
