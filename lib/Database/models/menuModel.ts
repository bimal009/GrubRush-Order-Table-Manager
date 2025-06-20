// Food Menu Types/Models

export interface MenuItem {
    _id: string
    name: string
    description: string
    price: number
    category: ICategory
    image?: string
    isAvailable: boolean
    isVegetarian?: boolean
    isVegan?: boolean
    isGlutenFree?: boolean
    spiceLevel?: 'mild' | 'medium' | 'hot' | 'very-hot'
    allergens?: string[]
    preparationTime?: number // in minutes
    calories?: number
    createdAt: Date
    updatedAt: Date
  }
  

  
  // Mongoose Schema (if using MongoDB)
  import mongoose, { Schema, Document } from 'mongoose'
import { ICategory } from './categoryModel'
  
 
  const menuItemSchema = new Schema<MenuItem>({
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    image: {
      type: String,
      trim: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
   
    preparationTime: {
      type: Number,
      min: 1,
      max: 120 // max 2 hours
    },
   
  }, {
    timestamps: true
  })
  
 
  
  // Export models
  export const MenuItem = mongoose.models.MenuItem || mongoose.model<MenuItem>('MenuItem', menuItemSchema)
  