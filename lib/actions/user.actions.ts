'use server'

import { revalidatePath } from 'next/cache'
import { CreateUserParams } from '@/types'
import { errorHandler } from '../utils'
import { connectToDatabase } from '../Database/MongoDb'
import User from '../Database/models/userModel'
import Event from '../Database/models/eventModel'
import Order from '../Database/models/orderModel'

export async function createUser(user: CreateUserParams): Promise<any | null> {
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

    const userToDelete = await User.findOne({ clerkId })
    if (!userToDelete) throw new Error('User not found')

    try {
      await Promise.all([
        Event.updateMany(
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
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    errorHandler(error)
    return null
  }
}
