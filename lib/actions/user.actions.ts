'use server'

import { revalidatePath } from 'next/cache'
import { CreateUserParams } from '@/types'
import { errorHandler } from '../utils'
import { connectToDatabase } from '../Database/MongoDb'
import User from '../Database/models/userModel'
import Order from '../Database/models/orderModel'
import HotelTable from '../Database/models/tableModel'
import { Users } from '@/components/admin/UsersData/columns'
import { clerkClient } from '@clerk/clerk-sdk-node'
import { handleError } from "../utils"
import { Types } from "mongoose"

export async function createUser(user: CreateUserParams): Promise<User | null> {
  try {
    await connectToDatabase()

    const requiredFields = ['clerkId', 'email', 'username', 'firstName', 'lastName', 'photo']
    const missingFields = requiredFields.filter(field => !(user as any)[field])

    if (missingFields.length > 0) {
      return null
    }

    const newUser = await User.create(user)
    return newUser.toObject()
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      console.error('Validation error:', error.errors)
    } else if (error.code === 11000) {
      console.error('Duplicate key error:', error.keyValue)
    }

    errorHandler(error)
    return null
  }
}

export async function updateUser(clerkId: string, user: {
  firstName?: string
  lastName?: string
  username?: string
  photo?: string
}) {
  try {
    await connectToDatabase()

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          ...(user.firstName && { firstName: user.firstName }),
          ...(user.lastName && { lastName: user.lastName }),
          ...(user.username && { username: user.username }),
          ...(user.photo && { photo: user.photo }),
        }
      },
      { new: true }
    )

    if (!updatedUser) throw new Error('User update failed')

    revalidatePath('/profile')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    errorHandler(error)
    return null
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()

    // Delete user from Clerk
    await clerkClient.users.deleteUser(clerkId)

    const userToDelete = await User.findOne({ clerkId })
    if (!userToDelete) throw new Error('User not found')

    try {
      await Promise.all([
        HotelTable.updateMany(
          { _id: { $in: userToDelete.events || [] } },
          { $pull: { organizer: userToDelete._id } }
        ),
        Order.updateMany(
          { _id: { $in: userToDelete.orders || [] } },
          { $unset: { buyer: 1 } }
        ),
      ])
    } catch (relError) {
      console.error('Relationship cleanup error:', relError)
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')
    if (deletedUser) {
      console.log('Deleted user:', deletedUser)
    } else {
      console.log('No user to delete')
    }
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    errorHandler(error)
    return null
  }
}

export async function getUsers(): Promise<Users[]> {
  try {
    await connectToDatabase()

    // Find all users, exclude password field
    const users = await User.find({}, { password: 0 })
    // Return only required fields
    return users.map(user => ({
      username: user.username,
      email: user.email,
      clerkId: user.clerkId,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo,
    }))

  } catch (error) {
    errorHandler(error)
    return []
  }
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface UserDocument {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
}

export const getUsersTable = async (): Promise<UserData[]> => {
  try {
    await connectToDatabase();
    const users = await User.find()
      .select('_id name email phone')
      .lean() as UserDocument[];

    return users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone
    }));
  } catch (error) {
    throw new Error(handleError(error));
  }
};