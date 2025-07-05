"use client";
import Search from '@/components/client/shared/Search';
import CategoryFilter from '@/components/client/shared/CategoryFilter';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import MenuCard from '@/components/client/shared/MenuCard';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { useQueryState } from 'nuqs';
import { useGetMenu } from '@/components/admin/api/useMenu';
import { MenuItem } from '@/types';

const Menu = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    
    const [currentPageState, setCurrentPage] = useQueryState('page', {
        defaultValue: '1',
        parse: (value) => value ?? '1',
    });
    
    const currentPage = parseInt(currentPageState || '1');
    const itemsPerPage = 6;
    
    const { data, isLoading, error } = useGetMenu(query, category, currentPage, itemsPerPage);
    
    const menuItems = data?.items || [];
    const totalPages = data?.pagination?.totalPages || 1;

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page.toString());
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        const currentPageNum = currentPage;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);

            let startPage = Math.max(2, currentPageNum - Math.floor(maxVisiblePages / 2));
            const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

            if (endPage === totalPages - 1) {
                startPage = Math.max(2, endPage - (maxVisiblePages - 3));
            }

            if (startPage > 2) {
                pageNumbers.push('ellipsis-start');
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages - 1) {
                pageNumbers.push('ellipsis-end');
            }

            if (totalPages > 1) {
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    return (
        <section className="container mx-auto px-4 py-8 relative">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-primary">Our Menu</h1>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
                    <div className="w-full sm:w-1/2">
                        <Search />
                    </div>
                    <div className="w-full sm:w-1/2">
                        <CategoryFilter />
                    </div>
                </div>
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

            {!isLoading && !error && menuItems.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg">No meals found. Try a different search or category filter.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((meal: MenuItem) => (
                    <MenuCard key={meal._id} item={meal} type="menu" />
                ))}
            </div>

        
            {!isLoading && !error && menuItems.length > 0 && (
                <div className="mt-10">
                    <Pagination>
                        <PaginationContent>
                            {currentPage > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(currentPage - 1);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handlePageChange(currentPage - 1);
                                            }
                                        }}
                                    />
                                </PaginationItem>
                            )}

                            {getPageNumbers().map((page, index) => (
                                <PaginationItem key={`page-${index}`}>
                                    {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                                        <span className="px-4" aria-hidden="true">...</span>
                                    ) : (
                                        <PaginationLink
                                            href="#"
                                            role="button"
                                            tabIndex={0}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(page as number);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handlePageChange(page as number);
                                                }
                                            }}
                                            isActive={page === currentPage}
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            {currentPage < totalPages && (
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(currentPage + 1);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handlePageChange(currentPage + 1);
                                            }
                                        }}
                                    />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </section>
    );
};

export default Menu;