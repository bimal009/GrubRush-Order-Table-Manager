"use server"

import Category, { ICategory } from "../Database/models/categoryModel"
import { connectToDatabase } from "../Database/MongoDb"
import { handleError } from "../utils"

export const getCategory = async () => {
    try {
        await connectToDatabase()
        const categories = await Category.find({}).lean()
        
        // Serialize the data to ensure it's JSON-safe for Client Components
        const serializedCategories = JSON.parse(JSON.stringify(categories))
        
        return { success: true, data: serializedCategories }
    } catch (error) {
        return { success: false, error: handleError(error) }
    }
}

export const createCategory = async (categoryData: Omit<ICategory, '_id'>) => {
    try {
        await connectToDatabase()
        const newCategory = await Category.create(categoryData)
        
        // Serialize the new category to ensure it's JSON-safe
        const serializedCategory = JSON.parse(JSON.stringify(newCategory))
        
        return { success: true, data: serializedCategory }
    } catch (error) {
        return { success: false, error: handleError(error) }
    }
}

// If you need to create multiple categories at once
export const createCategories = async (categoriesData: Omit<ICategory, '_id'>[]) => {
    try {
        await connectToDatabase()
        const newCategories = await Category.insertMany(categoriesData)
        
        // Serialize the new categories to ensure they're JSON-safe
        const serializedCategories = JSON.parse(JSON.stringify(newCategories))
        
        return { success: true, data: serializedCategories }
    } catch (error) {
        return { success: false, error: handleError(error) }
    }
}

export const updateCategory = async (id: string, categoryData: Partial<ICategory>) => {
    try {
        await connectToDatabase()
        const updatedCategory = await Category.findByIdAndUpdate(
            id, 
            categoryData, 
            { new: true, runValidators: true }
        ).lean()
        
        if (!updatedCategory) {
            return { success: false, error: "Category not found" }
        }
        
        // Serialize the updated category
        const serializedCategory = JSON.parse(JSON.stringify(updatedCategory))
        
        return { success: true, data: serializedCategory }
    } catch (error) {
        return { success: false, error: handleError(error) }
    }
}

export const deleteCategory = async (id: string) => {
    try {
        await connectToDatabase()
        const deletedCategory = await Category.findByIdAndDelete(id)
        
        if (!deletedCategory) {
            return { success: false, error: "Category not found" }
        }
        
        return { success: true, data: null }
    } catch (error) {
        return { success: false, error: handleError(error) }
    }
}