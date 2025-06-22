"use server"

import Order from "../Database/models/orderModel";
import HotelTable from "../Database/models/tableModel";
import User from "../Database/models/userModel";
import { connectToDatabase } from "../Database/MongoDb";
import { handleError } from "../utils";
import { getUserByClerkId } from "./user.actions";
import { revalidatePath } from "next/cache";

// Utility function to serialize order data for client compatibility
const serializeOrder = (order: any) => ({
    ...order,
    _id: String(order._id),
    buyer: order.buyer ? {
        ...order.buyer,
        _id: String(order.buyer._id)
    } : null,
    table: order.table ? {
        ...order.table,
        _id: String(order.table._id),
        currentOrders: order.table.currentOrders ? order.table.currentOrders.map((orderId: any) => String(orderId)) : []
    } : null,
    orderItems: order.orderItems ? order.orderItems.map((item: any) => ({
        ...item,
        _id: item._id ? String(item._id) : undefined,
        menuItem: item.menuItem ? {
            ...item.menuItem,
            _id: String(item.menuItem._id),
            category: item.menuItem.category ? String(item.menuItem.category) : undefined,
            // Ensure all other fields are plain objects/values
            name: item.menuItem.name,
            description: item.menuItem.description,
            price: item.menuItem.price,
            image: item.menuItem.image,
            isAvailable: item.menuItem.isAvailable,
            preparationTime: item.menuItem.preparationTime
        } : undefined
    })) : []
});

// Common populate configuration for orders with menu items
const getOrderPopulateConfig = () => [
    {
        path: 'buyer',
        select: 'username email firstName lastName photo clerkId'
    },
    {
        path: 'table',
        select: 'tableNumber capacity location status isAvailable isReserved isPaid currentOrders',
        populate: {
            path: 'currentOrders',
            select: 'totalAmount estimatedServeTime quantity createdAt orderItems status',
            populate: {
                path: 'orderItems.menuItem',
                select: 'name description price category image isAvailable preparationTime'
            }
        }
    },
    {
        path: 'orderItems.menuItem',
        select: 'name description price category image isAvailable preparationTime'
    }
];

export const createOrder = async (data: any) => {
   try {
    await connectToDatabase();

    console.log("Creating order with", data.orderItems?.length || 0, "items");

    // Get the MongoDB user by Clerk ID
    const user = await getUserByClerkId(data.buyer);
    if (!user) {
        throw new Error("User not found");
    }

    // Validate status if provided
    const validStatuses = ['pending', 'preparing', 'served', 'cancelled'];
    const status = data.status && validStatuses.includes(data.status) ? data.status : 'pending';

    // Create a clean order data object
    const orderData = {
        orderItems: data.orderItems || [],
        table: data.table,
        buyer: user._id,
        totalAmount: data.totalAmount,
        quantity: data.quantity,
        status: status // Use validated status, default to 'pending'
    };

    console.log("Final order data prepared");

    const order = await Order.create(orderData);
    if (!order) {
        throw new Error("Order creation failed");
    }

    // Populate the created order with buyer, table, and menu item information
    const populatedOrder = await Order.findById(order._id)
        .populate(getOrderPopulateConfig())
        .lean();

    if (!populatedOrder) {
        throw new Error("Failed to populate order data");
    }

    const table = await HotelTable.findById(data.table);
    if (!table) {
        throw new Error("Table not found");
    }

    // Update table with order reference and status
    await HotelTable.findByIdAndUpdate(data.table, {
        $set: {
            status: status, // Use the same status as the order
            isAvailable: false
        },
        $push: {
            currentOrders: order._id
        }
    });

    console.log("Order created successfully with ID:", order._id);
    
    // Serialize the populated order for client compatibility
    const serializedOrder = serializeOrder(populatedOrder);
    
    // Return the populated order data that can be directly used in currentOrders array
    return { 
        success: true, 
        data: {
            order: serializedOrder,
            orderId: String(order._id),
            totalAmount: order.totalAmount,
            // Return a simplified version for currentOrders array
            currentOrderData: {
                _id: String(order._id),
                totalAmount: order.totalAmount,
                quantity: order.quantity,
                createdAt: order.createdAt,
                estimatedServeTime: order.estimatedServeTime,
                buyer: {
                    _id: String(user._id),
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    photo: user.photo
                },
                orderItems: serializedOrder.orderItems // Now includes populated menu items
            }
        }
    };
   } catch (error) {
    console.error("Error creating order:", error instanceof Error ? error.message : String(error));
    return { success: false, error: handleError(error) };
   }
}

export const GetOrders = async () => {
    try {
        await connectToDatabase();
        
        // Get orders with menu items populated
        const orders = await Order.find()
            .populate(getOrderPopulateConfig())
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean();

        console.log("Retrieved", orders.length, "orders");
        
        // Convert ObjectIds to strings for client compatibility
        const serializedOrders = orders.map(serializeOrder);
        
        return { success: true, data: serializedOrders };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
}

export const getOrdersByTable = async (tableId: string) => {
    try {
        await connectToDatabase();
        
        const orders = await Order.find({ table: tableId })
            .populate(getOrderPopulateConfig())
            .sort({ createdAt: -1 })
            .lean();

        // Convert ObjectIds to strings for client compatibility
        const serializedOrders = orders.map(serializeOrder);

        return { success: true, data: serializedOrders };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
}

export const getOrdersByUser = async (clerkId: string) => {
    try {
        await connectToDatabase();
        
        const user = await getUserByClerkId(clerkId);
        if (!user) {
            throw new Error("User not found");
        }

        const orders = await Order.find({ buyer: user._id })
            .populate(getOrderPopulateConfig())
            .sort({ createdAt: -1 })
            .lean();

        // Convert ObjectIds to strings for client compatibility
        const serializedOrders = orders.map(serializeOrder);

        return { success: true, data: serializedOrders };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
}

export const updateOrder = async (orderId: string | string[], updateData: {
    estimatedServeTime?: number | null;
    totalAmount?: string;
    quantity?: number;
}) => {
    try {
        await connectToDatabase();

        // Handle both single orderId and array of orderIds
        const orderIds = Array.isArray(orderId) ? orderId : [orderId];

        const updatedOrders = [];
        const tablesToUpdate = new Set();

        // Update each order
        for (const id of orderIds) {
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true }
            )
            .populate(getOrderPopulateConfig())
            .lean();

            if (!updatedOrder) {
                throw new Error(`Order not found with ID: ${id}`);
            }

            updatedOrders.push(updatedOrder);

            // If order is being completed (estimatedServeTime is set), track table for update
            if (updateData.estimatedServeTime && updatedOrder.table) {
                tablesToUpdate.add(updatedOrder.table._id.toString());
            }
        }

        // Handle table updates for completed orders
        if (updateData.estimatedServeTime) {
            for (const tableId of tablesToUpdate) {
                // Remove completed orders from table's currentOrders
                await HotelTable.findByIdAndUpdate(tableId, {
                    $pull: {
                        currentOrders: { $in: orderIds }
                    }
                });

                // Check if table has any remaining current orders
                const updatedTable = await HotelTable.findById(tableId);
                if (updatedTable && (!updatedTable.currentOrders || updatedTable.currentOrders.length === 0)) {
                    // No more current orders, mark table as available
                    await HotelTable.findByIdAndUpdate(tableId, {
                        $set: {
                            status: "completed",
                            isAvailable: true
                        }
                    });
                }
            }
        }

        // Convert ObjectIds to strings for client compatibility
        const serializedOrders = updatedOrders.map(serializeOrder);

        // Return single order if only one was updated, otherwise return array
        return { 
            success: true, 
            data: Array.isArray(orderId) ? serializedOrders : serializedOrders[0] 
        };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
}

// New function specifically for bulk order updates
export const bulkUpdateOrders = async (orderIds: string[], updateData: {
    estimatedServeTime?: number | null;
    totalAmount?: string;
    quantity?: number;
}) => {
    try {
        await connectToDatabase();

        const updatedOrders = [];
        const tablesToUpdate = new Set();

        // Update all orders in parallel for better performance
        const updatePromises = orderIds.map(async (id) => {
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true }
            )
            .populate(getOrderPopulateConfig())
            .lean();

            if (!updatedOrder) {
                throw new Error(`Order not found with ID: ${id}`);
            }

            // Track table for update if order is being completed
            if (updateData.estimatedServeTime && updatedOrder.table) {
                tablesToUpdate.add(updatedOrder.table._id.toString());
            }

            return updatedOrder;
        });

        const results = await Promise.all(updatePromises);
        updatedOrders.push(...results);

        // Handle table updates for completed orders
        if (updateData.estimatedServeTime) {
            const tableUpdatePromises = Array.from(tablesToUpdate).map(async (tableId) => {
                // Remove completed orders from table's currentOrders
                await HotelTable.findByIdAndUpdate(tableId, {
                    $pull: {
                        currentOrders: { $in: orderIds }
                    }
                });

                // Check if table has any remaining current orders
                const updatedTable = await HotelTable.findById(tableId);
                if (updatedTable && (!updatedTable.currentOrders || updatedTable.currentOrders.length === 0)) {
                    // No more current orders, mark table as available
                    await HotelTable.findByIdAndUpdate(tableId, {
                        $set: {
                            status: "completed",
                            isAvailable: true
                        }
                    });
                }
            });

            await Promise.all(tableUpdatePromises);
        }

        // Convert ObjectIds to strings for client compatibility
        const serializedOrders = updatedOrders.map(serializeOrder);

        return { success: true, data: serializedOrders };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
}

// Function to delete an order
export const deleteOrder = async (orderId: string) => {
    try {
        await connectToDatabase();

        const deletedOrder = await Order.findByIdAndDelete(orderId)
            .populate(getOrderPopulateConfig())
            .lean();

        if (!deletedOrder) {
            throw new Error("Order not found");
        }

        // Remove the order from table's currentOrders when order is deleted
        await HotelTable.findByIdAndUpdate(deletedOrder.table._id, {
            $pull: {
                currentOrders: orderId
            }
        });

        // Check if table has any remaining current orders
        const updatedTable = await HotelTable.findById(deletedOrder.table._id);
        if (updatedTable && (!updatedTable.currentOrders || updatedTable.currentOrders.length === 0)) {
            // No more current orders, mark table as available
            await HotelTable.findByIdAndUpdate(deletedOrder.table._id, {
                $set: {
                    status: "pending",
                    isAvailable: true
                }
            });
        }

        // Convert ObjectIds to strings for client compatibility
        const serializedOrder = serializeOrder(deletedOrder);

        return { success: true, data: serializedOrder };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
}

export const getOrderById = async (orderId: string) => {
    try {
        await connectToDatabase();

        const order = await Order.findById(orderId)
            .populate(getOrderPopulateConfig())
            .lean();

        if (!order) {
            throw new Error("Order not found");
        }

        // Convert ObjectIds to strings for client compatibility
        const serializedOrder = serializeOrder(order);

        return { success: true, data: serializedOrder };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
}

export const updateOrderStatus = async (orderId: string, status: string) => {
    if (!orderId || !status) {
        return { success: false, error: "Invalid order ID or status" };
    }

    const validStatuses = ['pending', 'preparing', 'served', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return { success: false, error: "Invalid status. Must be one of: pending, preparing, served, cancelled" };
    }

    try {
        await connectToDatabase();

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, 
            { $set: { status } }, 
            { new: true }
        )
        .populate(getOrderPopulateConfig())
        .lean();

        if (!updatedOrder) {
            return { success: false, error: "Order not found" };
        }

        // Update table status if order is being prepared
        if (status === 'preparing') {
            await HotelTable.findByIdAndUpdate(updatedOrder.table._id, {
                $set: { status: 'preparing' }
            });
        }
        if (status === 'served') {
            await HotelTable.findByIdAndUpdate(updatedOrder.table._id, {
                $set: { status: 'served' }
            });
        }
        if (status === 'cancelled') {
            await HotelTable.findByIdAndUpdate(updatedOrder.table._id, {
                $set: { status: 'cancelled' }
            });
        }

        const serializedOrder = serializeOrder(updatedOrder);

        return { success: true, data: serializedOrder };
    } catch (error) {
        return { success: false, error: handleError(error) };
    }
}

export const markOrderAsPaid = async (orderId: string) => {
    try {
        await connectToDatabase();

        const order = await Order.findByIdAndUpdate(orderId, {
            $set: {
                isPaid: true,
                status: "served"
            }
        });

        if (!order) {
            return { success: false, message: "Order not found" };
        }

        console.log("Order found:", order);

        // Fix the MongoDB update syntax - use $pull directly, not inside $set
        const updatedTable = await HotelTable.findByIdAndUpdate(order.table._id, {
            $set: {
                isPaid: true,
                status: "served"
            },
            $pull: {
                currentOrders: orderId
            }
        });

        if (!updatedTable) {
            return { success: false, message: "Table not found" };
        }

        console.log("Updated table:", updatedTable);

        revalidatePath("/admin/orders");

        return { success: true, message: "Order marked as paid" };
    } catch (error) {
        console.error("Error marking order as paid:", error);
        return { success: false, message: "Failed to mark order as paid" };
    }
}