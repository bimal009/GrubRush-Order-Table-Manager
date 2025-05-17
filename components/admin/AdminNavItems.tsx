import { Utensils } from 'lucide-react';
import Link from 'next/link'
import React, { useState } from 'react'

const Navigations = [
    {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    },
    {
        label: 'Manage Orders',
        href: '/admin/orders',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
    },
    {
        label: 'Manage Menu',
        href: '/admin/menu',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h18" /><path d="M3 12h18" /><path d="M3 17h18" /></svg>
    },
    {
        label: 'Manage Tables',
        href: '/admin/tables',
        icon: <Utensils size={18} />
    },
    {
        label: 'Total Sales',
        href: '/admin/sales',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
    },
];
const AdminNavItems = () => {
    const [activeItem, setActiveItem] = useState('/admin/tables');

    return (
        <ul className='flex flex-col gap-2'>
            {Navigations.map((item) => (
                <li key={item.href}>
                    <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeItem === item.href
                            ? 'bg-orange-50 text-orange-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        onClick={() => setActiveItem(item.href)}
                    >
                        <span className={activeItem === item.href ? 'text-orange-600' : 'text-gray-500'}>
                            {item.icon}
                        </span>
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default AdminNavItems;
