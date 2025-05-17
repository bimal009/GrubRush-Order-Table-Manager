"use client";
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useQueryState } from 'nuqs';
import { FormEvent } from 'react';

const Search = () => {
    const [searchQuery, setSearchQuery] = useQueryState('search',);
    const debouncedSearchQuery = useDebounce(searchQuery || '', 500);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-1/2 mx-auto">
            <Input
                value={searchQuery || ''}
                name="search"
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search for a food"
            />
            <Button type="submit">Search</Button>
        </form>
    );
};

export default Search;