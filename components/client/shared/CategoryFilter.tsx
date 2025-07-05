"use client";

import { useQueryState } from 'nuqs';
import { useGetCategories } from '@/components/admin/api/useCategories';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CategoryFilter = () => {
    const { data: categories, isLoading } = useGetCategories();
    const [selectedCategory, setSelectedCategory] = useQueryState('category', {
        defaultValue: '',
        parse: (value) => value ?? '',
    });

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId === 'all' ? '' : categoryId);
    };

    if (isLoading) {
        return (
            <div className="w-full">
                <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default CategoryFilter; 