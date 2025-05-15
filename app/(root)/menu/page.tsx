"use client";
import { useGetData } from '@/components/client/api/useMenu';
import Search from '@/components/client/shared/Search';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import MenuCard from '@/components/client/shared/MenuCard';



const MenuPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('search') || '';
    const { data, isLoading, error } = useGetData(query);

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Our Menu</h1>
                <Search />
            </div>

            {isLoading && (
                <div className="text-center py-12">
                    <p className="text-lg">Loading meals...</p>
                </div>
            )}

            {error && (
                <div className="text-center py-12">
                    <p className="text-lg text-red-500">Error: {(error as Error).message}</p>
                </div>
            )}

            {!isLoading && !error && data?.meals?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg">No meals found. Try a different search.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.meals?.map((meal: any) => (
                    <MenuCard key={meal.idMeal} meal={meal} />
                ))}
            </div>
        </main>
    );
};

export default MenuPage;