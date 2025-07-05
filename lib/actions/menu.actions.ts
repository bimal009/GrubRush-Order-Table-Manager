"use server"

import Category from "../Database/models/categoryModel";
import { MenuItem } from "../Database/models/menuModel";
import { connectToDatabase } from "../Database/MongoDb";
import { handleError } from "../utils";
import { CreateMenuParams } from "@/types";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types";

// Cache for categories to avoid repeated DB calls
let categoryCache: Map<string, any> = new Map();
let cacheExpiry = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedCategory = async (categoryId: string) => {
    const now = Date.now();
    
    if (now > cacheExpiry) {
        categoryCache.clear();
        cacheExpiry = now + CACHE_DURATION;
    }
    
    if (categoryCache.has(categoryId)) {
        return categoryCache.get(categoryId);
    }
    
    const category = await Category.findById(categoryId).lean();
    if (category) {
        categoryCache.set(categoryId, category);
    }
    
    return category;
};

export const getMenu = async (
    query?: string, 
    category?: string,
    page = 1,
    limit = 50,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
): Promise<ApiResponse<any>> => {
    try {
        await connectToDatabase();
        
        let searchCondition: any = {};
        
        // Add search query condition with better indexing
        if (query) {
            searchCondition.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }
        
        // Add category filter condition
        if (category) {
            searchCondition.category = category;
        }

        const skip = (page - 1) * limit;
        const sortOptions: any = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Use aggregation for better performance with large datasets
        const pipeline = [
            { $match: searchCondition },
            { $sort: sortOptions },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryData'
                }
            },
            {
                $addFields: {
                    category: { $arrayElemAt: ['$categoryData', 0] }
                }
            },
            {
                $project: {
                    categoryData: 0,
                    'category.createdAt': 0,
                    'category.updatedAt': 0,
                    'category.__v': 0
                }
            }
        ];

        const [menu, total] = await Promise.all([
            MenuItem.aggregate(pipeline),
            MenuItem.countDocuments(searchCondition)
        ]);

        return { 
            success: true, 
            data: {
                items: JSON.parse(JSON.stringify(menu)),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
};

export const createMenuItem = async (menuItem: CreateMenuParams): Promise<ApiResponse<any>> => {
    try {
        await connectToDatabase();

        // Validate required fields
        if (!menuItem.name || !menuItem.price || !menuItem.category) {
            throw new Error("Name, price, and category are required");
        }

        // Validate category exists using cache
        const category = await getCachedCategory(menuItem.category);
        if (!category) {
            throw new Error("Category not found");
        }

        // Check if menu item with same name already exists
        const existingItem = await MenuItem.findOne({ 
            name: { $regex: new RegExp(`^${menuItem.name}$`, 'i') }
        });
        
        if (existingItem) {
            throw new Error("Menu item with this name already exists");
        }
        
        const newMenuItem = await MenuItem.create({ 
            ...menuItem, 
            category: category._id 
        });

        // Populate the category for return
        const populatedMenuItem = await MenuItem.findById(newMenuItem._id)
            .populate({
                path: 'category',
                select: '_id name'
            })
            .lean();

        revalidatePath("/admin/menu");
        return { success: true, data: JSON.parse(JSON.stringify(populatedMenuItem)) };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
};

export const deleteMenuItem = async ({ id }: { id: string }): Promise<ApiResponse<null>> => {
    try {
        await connectToDatabase();
        
        if (!id) {
            throw new Error("Menu item ID is required");
        }

        const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
        if (!deletedMenuItem) {
            return { success: false, error: "Menu item not found" };
        }
        
        revalidatePath("/admin/menu");
        return { success: true, data: null };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
};

export const updateMenuItem = async (id: string, menuItem: CreateMenuParams): Promise<ApiResponse<any>> => {
    try {
        await connectToDatabase();

        if (!id) {
            throw new Error("Menu item ID is required");
        }

        // Validate required fields
        if (!menuItem.name || !menuItem.price || !menuItem.category) {
            throw new Error("Name, price, and category are required");
        }

        // Validate category exists using cache
        const category = await getCachedCategory(menuItem.category);
        if (!category) {
            throw new Error("Category not found");
        }

        // Check if another menu item with same name exists (excluding current item)
        const existingItem = await MenuItem.findOne({ 
            name: { $regex: new RegExp(`^${menuItem.name}$`, 'i') },
            _id: { $ne: id }
        });
        
        if (existingItem) {
            throw new Error("Another menu item with this name already exists");
        }
        
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            id,
            { ...menuItem, category: category._id },
            { new: true, runValidators: true }
        ).populate({
            path: 'category',
            select: '_id name'
        }).lean();

        if (!updatedMenuItem) {
            return { success: false, error: "Menu item not found" };
        }

        revalidatePath("/admin/menu");
        return { success: true, data: JSON.parse(JSON.stringify(updatedMenuItem)) };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
};

export const toggleMenuItemAvailability = async (id: string, isAvailable: boolean): Promise<ApiResponse<any>> => {
    try {
        await connectToDatabase();
        
        if (!id) {
            throw new Error("Menu item ID is required");
        }
        
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            id,
            { isAvailable },
            { new: true }
        ).populate({
            path: 'category',
            select: '_id name'
        }).lean();

        if (!updatedMenuItem) {
            return { success: false, error: "Menu item not found" };
        }

        revalidatePath("/admin/menu");
        return { success: true, data: JSON.parse(JSON.stringify(updatedMenuItem)) };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
};

// Bulk operations for better performance
export const bulkUpdateMenuItems = async (
    ids: string[], 
    updateData: Partial<CreateMenuParams>
): Promise<ApiResponse<any>> => {
    try {
        await connectToDatabase();
        
        if (!ids?.length) {
            throw new Error("Menu item IDs are required");
        }

        // Validate category if provided
        if (updateData.category) {
            const category = await getCachedCategory(updateData.category);
            if (!category) {
                throw new Error("Category not found");
            }
            updateData.category = category._id;
        }

        const result = await MenuItem.updateMany(
            { _id: { $in: ids } },
            { $set: updateData },
            { runValidators: true }
        );

        if (result.matchedCount === 0) {
            return { success: false, error: "No menu items found" };
        }

        // Get updated items
        const updatedItems = await MenuItem.find({ _id: { $in: ids } })
            .populate({
                path: 'category',
                select: '_id name'
            })
            .lean();

        revalidatePath("/admin/menu");
        return { 
            success: true, 
            data: {
                updatedCount: result.modifiedCount,
                items: updatedItems
            }
        };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
};

export const bulkToggleAvailability = async (
    ids: string[], 
    isAvailable: boolean
): Promise<ApiResponse<any>> => {
    try {
        await connectToDatabase();
        
        if (!ids?.length) {
            throw new Error("Menu item IDs are required");
        }

        const result = await MenuItem.updateMany(
            { _id: { $in: ids } },
            { $set: { isAvailable } }
        );

        if (result.matchedCount === 0) {
            return { success: false, error: "No menu items found" };
        }

        revalidatePath("/admin/menu");
        return { 
            success: true, 
            data: {
                updatedCount: result.modifiedCount,
                message: `${result.modifiedCount} items ${isAvailable ? 'enabled' : 'disabled'}`
            }
        };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
};

// Get menu items by category with caching
export const getMenuByCategory = async (categoryId: string): Promise<ApiResponse<any>> => {
    try {
        await connectToDatabase();
        
        if (!categoryId) {
            throw new Error("Category ID is required");
        }

        const category = await getCachedCategory(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }

        const menuItems = await MenuItem.find({ category: categoryId })
            .select('name description price image isAvailable preparationTime')
            .sort({ name: 1 })
            .lean();

        return { 
            success: true, 
            data: {
                category: {
                    _id: category._id,
                    name: category.name
                },
                items: menuItems
            }
        };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
};