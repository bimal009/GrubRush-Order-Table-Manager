"use client"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useQueryState } from 'nuqs'


const Search = () => {
    const [searchQuery, setSearchQuery] = useQueryState('search')
    return (
        <form action="/menu" className="flex items-center gap-2">

            <Input
                value={searchQuery || ''}
                name="search"
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search for a food"
            />
            <Button type="submit">Search</Button>
        </form>
    )
}

export default Search
