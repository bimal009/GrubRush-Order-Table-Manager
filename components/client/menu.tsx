"use client";
import Search from '@/components/client/shared/Search';
import React, { useEffect, } from 'react';
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
    const { data, isLoading, error } = useGetMenu(query);
    console.log("menu data",data)
    // Pagination state from URL with fallback for SSR
    const [currentPageState, setCurrentPage] = useQueryState('page', {
        defaultValue: '1',
        parse: (value) => value ?? '1',
    });

    // Ensure we have a valid currentPage even during SSR
    const currentPage = currentPageState || '1';

    const itemsPerPage = 6; // 3 items per row × 2 rows

    // Calculate pagination values
    const totalItems = data?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Reset to page 1 when search changes
    useEffect(() => {
        if (query) {
            setCurrentPage('1');
        }
    }, [query, setCurrentPage]);

    // Get current page data
    const getCurrentPageData = () => {
        const pageNum = parseInt(currentPage) || 1;
        const startIndex = (pageNum - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data?.slice(startIndex, endIndex) || [];
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page.toString());
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5; // Maximum number of page numbers to show
        const currentPageNum = parseInt(currentPage) || 1;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always include first page
            pageNumbers.push(1);

            // Calculate start and end of visible page range
            let startPage = Math.max(2, currentPageNum - Math.floor(maxVisiblePages / 2));
            const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

            // Adjust start if end is too close to total
            if (endPage === totalPages - 1) {
                startPage = Math.max(2, endPage - (maxVisiblePages - 3));
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pageNumbers.push('ellipsis-start');
            }

            // Add pages in the middle
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pageNumbers.push('ellipsis-end');
            }

            // Always include last page
            if (totalPages > 1) {
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    return (
        <main className="container mx-auto px-4 py-8 h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-primary">Our Menu</h1>
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

            {!isLoading && !error && data?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg">No meals found. Try a different search.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentPageData().map((meal: MenuItem) => (
                    <MenuCard key={meal._id} item={meal} type="menu" />
                ))}
            </div>

            {!isLoading && !error && data && data.length > 0 && (
                <div className="mt-10">
                    <Pagination>
                        <PaginationContent>
                            {parseInt(currentPage) > 1 && (
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(parseInt(currentPage) - 1);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handlePageChange(parseInt(currentPage) - 1);
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
                                            isActive={page === parseInt(currentPage)}
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            {parseInt(currentPage) < totalPages && (
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(parseInt(currentPage) + 1);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handlePageChange(parseInt(currentPage) + 1);
                                            }
                                        }}
                                    />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </main>
    );
};

export default Menu;