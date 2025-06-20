"use server"

import Order from "../Database/models/orderModel";
import { connectToDatabase } from "../Database/MongoDb";
import { handleError } from "../utils";
import { getUserByClerkId } from "./user.actions";

export const createOrder = async (data: any) => {
   try {
    await connectToDatabase();

    // Get the MongoDB user by Clerk ID
    const user = await getUserByClerkId(data.buyer);
    if (!user) {
        throw new Error("User not found");
    }

    // Create order with MongoDB user ID instead of Clerk ID
    const orderData = {
        ...data,
        buyer: user._id, // Use MongoDB ObjectId
        table: data.table, // This should already be an ObjectId
    };

    const order = await Order.create(orderData);
    if (!order) {
        throw new Error("Order not found");
    }
    
    return { success: true, data: order };
   } catch (error) {
    return { success: false, error: handleError(error) };
   }
}

export const updateOrder = async (data: any) => {
    console.log(data)
    return { _id: "123" }
}

export const deleteOrder = async (orderId: string) => {
    console.log(orderId)
}
