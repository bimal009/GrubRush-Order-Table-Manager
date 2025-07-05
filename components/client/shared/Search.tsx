"use client";
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Input } from '../../ui/input';
import { useQueryState } from 'nuqs';

const Search = () => {
    const [searchQuery, setSearchQuery] = useQueryState('search');

    return (
        <div className="w-full max-w-md mx-auto">
            <Input
                value={searchQuery || ''}
                name="search"
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search for a food..."
                className="w-full"
            />
        </div>
    );
};

export default Search;