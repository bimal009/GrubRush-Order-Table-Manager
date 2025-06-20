"use server"

import Category from "../Database/models/categoryModel";
import { MenuItem } from "../Database/models/menuModel";
import { connectToDatabase } from "../Database/MongoDb";
import { handleError } from "../utils";
import { CreateMenuParams } from "@/types";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types";

export const getMenu = async (query?: string): Promise<ApiResponse<any>> => {
    try {
        await connectToDatabase();
        
        const searchCondition = query ? {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        } : {};

        const menu = await MenuItem.find(searchCondition).populate({
            path: 'category',
            select: '_id name'
        }).lean();

        // Serialize the data to ensure it's JSON-safe
        const serializedMenu = JSON.parse(JSON.stringify(menu));
        
        return { success: true, data: serializedMenu };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
}

export const createMenuItem = async (menuItem: CreateMenuParams): Promise<ApiResponse<any>> => {
    try {
        await connectToDatabase();

        const category = await Category.findById(menuItem.category);
        if (!category) {
            throw new Error("Category not found");
        }
        
        const newMenuItem = await MenuItem.create({ ...menuItem, category: category._id });
        await newMenuItem.populate({
            path: 'category',
            select: '_id name'
        });

        // Serialize the new menu item to ensure it's JSON-safe
        const serializedMenuItem = JSON.parse(JSON.stringify(newMenuItem));
        
        revalidatePath("/admin/menu");
        return { success: true, data: serializedMenuItem };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
}

export const deleteMenuItem = async ({ id }: { id: string }): Promise<ApiResponse<null>> => {
    try {
        await connectToDatabase();
        const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
        if (!deletedMenuItem) {
            return { success: false, error: "Menu item not found" };
        }
        revalidatePath("/admin/menu");
        return { success: true, data: null };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
}