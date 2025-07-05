"use server"

import Order from "../Database/models/orderModel";
import HotelTable from "../Database/models/tableModel";
import User from "../Database/models/userModel";
import { connectToDatabase } from "../Database/MongoDb";
import { handleError } from "../utils";
import { getUserByClerkId } from "./user.actions";
import { revalidatePath } from "next/cache";

// Optimized serialization with better performance
const serializeOrder = (order: any) => {
    if (!order) return null;
    
    return {
        _id: String(order._id),
        createdAt: order.createdAt?.toISOString?.() || order.createdAt,
        updatedAt: order.updatedAt?.toISOString?.() || order.updatedAt,
        totalAmount: order.totalAmount,
        quantity: order.quantity,
        status: order.status,
        isPaid: order.isPaid,
        estimatedServeTime: order.estimatedServeTime,
        
        buyer: order.buyer ? {
            _id: String(order.buyer._id),
            username: order.buyer.username,
            email: order.buyer.email,
            firstName: order.buyer.firstName,
            lastName: order.buyer.lastName,
            photo: order.buyer.photo,
            clerkId: order.buyer.clerkId
        } : null,

        table: order.table ? {
            _id: String(order.table._id),
            tableNumber: order.table.tableNumber,
            capacity: order.table.capacity,
            location: order.table.location,
            status: order.table.status,
            isAvailable: order.table.isAvailable,
            isReserved: order.table.isReserved,
            isPaid: order.table.isPaid,
            currentOrders: order.table.currentOrders?.map((id: any) => String(id)) || [],
        } : null,

        orderItems: order.orderItems?.map((item: any) => {
            const menuItem = item.menuItem ? {
                _id: String(item.menuItem._id),
                name: item.menuItem.name,
                description: item.menuItem.description,
                price: item.menuItem.price,
                category: item.menuItem.category ? String(item.menuItem.category) : undefined,
                image: item.menuItem.image,
                isAvailable: item.menuItem.isAvailable,
                preparationTime: item.menuItem.preparationTime
            } : null;

            return {
                _id: String(item._id),
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                specialInstructions: item.specialInstructions,
                estimatedServeTime: item.estimatedServeTime,
                menuItem: menuItem
            };
        }) || []
    };
};

// Optimized populate configuration - only select needed fields
const getOrderPopulateConfig = () => [
    {
        path: 'buyer',
        select: 'username email firstName lastName photo clerkId'
    },
    {
        path: 'table',
        select: 'tableNumber capacity location status isAvailable isReserved isPaid currentOrders'
    },
    {
        path: 'orderItems.menuItem',
        select: 'name description price category image isAvailable preparationTime'
    }
];

export const createOrder = async (data: any) => {
    try {
        await connectToDatabase();

        // Validate required fields
        if (!data.buyer || !data.table || !data.orderItems?.length) {
            throw new Error("Missing required fields: buyer, table, or orderItems");
        }

        // Validate status
        const validStatuses = ['pending', 'preparing', 'served', 'cancelled'];
        const status = data.status && validStatuses.includes(data.status) ? data.status : 'pending';

        // Use Promise.all for concurrent operations
        const [user, table] = await Promise.all([
            getUserByClerkId(data.buyer),
            HotelTable.findById(data.table).lean()
        ]);

        if (!user) {
            throw new Error("User not found");
        }

        if (!table) {
            throw new Error("Table not found");
        }

        // Create order with session for atomicity
        const session = await Order.startSession();
        let newOrder: any;
        
        try {
            await session.withTransaction(async () => {
                const orderData = {
                    orderItems: data.orderItems,
                    table: data.table,
                    buyer: user._id,
                    totalAmount: data.totalAmount,
                    quantity: data.quantity,
                    status: status
                };

                const [order] = await Order.create([orderData], { session });
                newOrder = order;

                // Update table atomically
                await HotelTable.findByIdAndUpdate(
                    data.table,
                    {
                        $set: {
                            status: status,
                            isAvailable: false
                        },
                        $addToSet: { // Use $addToSet to avoid duplicates
                            currentOrders: order._id
                        }
                    },
                    { session }
                );
            });
        } finally {
            await session.endSession();
        }

        if (!newOrder) {
            throw new Error("Order creation failed, please try again.");
        }

        // Fetch populated order
        const populatedOrder = await Order.findById(newOrder._id)
            .populate(getOrderPopulateConfig())
            .lean();

        if (!populatedOrder) {
            throw new Error("Failed to retrieve created order");
        }

        const serializedOrder = serializeOrder(populatedOrder);
        
        return { 
            success: true, 
            data: {
                order: serializedOrder,
                orderId: String(populatedOrder._id)
            }
        };

    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: handleError(error) };
    }
};

export const GetOrders = async (page = 1, limit = 50, status?: string) => {
    try {
        await connectToDatabase();
        
        const skip = (page - 1) * limit;
        let filter = {};
        
        if (status) {
            filter = { status };
        }

        // Use aggregation for better performance with large datasets
        const pipeline = [
            { $match: filter },
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    orders: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'buyer',
                                foreignField: '_id',
                                as: 'buyer',
                                pipeline: [
                                    { $project: { username: 1, email: 1, firstName: 1, lastName: 1, photo: 1, clerkId: 1 } }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: 'hoteltables',
                                localField: 'table',
                                foreignField: '_id',
                                as: 'table',
                                pipeline: [
                                    { $project: { tableNumber: 1, capacity: 1, location: 1, status: 1, isAvailable: 1, isReserved: 1, isPaid: 1, currentOrders: 1 } }
                                ]
                            }
                        },
                        { $unwind: { path: '$buyer', preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: '$table', preserveNullAndEmptyArrays: true } }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ];

        const [result] = await Order.aggregate(pipeline as any);
        const orders = result.orders || [];
        const total = result.totalCount?.[0]?.count || 0;

        const serializedOrders = orders.map(serializeOrder);
        
        return { 
            success: true, 
            data: {
                orders: serializedOrders,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        };
    } catch (error) {
        console.error("Error getting orders:", error);
        return { success: false, error: handleError(error) };
    }
};

export const getOrdersByTable = async (tableId: string) => {
    try {
        await connectToDatabase();
        
        if (!tableId) {
            throw new Error("Table ID is required");
        }
        
        const orders = await Order.find({ table: tableId })
            .populate(getOrderPopulateConfig())
            .sort({ createdAt: -1 })
            .lean();

        const serializedOrders = orders.map(serializeOrder);

        return { success: true, data: serializedOrders };
    } catch (error) {
        console.error("Error getting orders by table:", error);
        return { success: false, error: handleError(error) };
    }
};

export const getOrdersByUser = async (userId: string) => {
    try {
        await connectToDatabase();
        
        if (!userId) {
            throw new Error("User ID is required");
        }
        
        // Direct query instead of separate user lookup
        const orders = await Order.find({ buyer: userId })
            .populate(getOrderPopulateConfig())
            .sort({ createdAt: -1 })
            .lean();

        const serializedOrders = orders.map(serializeOrder);

        return { success: true, data: serializedOrders };
    } catch (error) {
        console.error("Error getting orders by user:", error);
        return { success: false, error: handleError(error) };
    }
};

export const updateOrder = async (
    orderId: string | string[], 
    updateData: {
        estimatedServeTime?: number | null;
        totalAmount?: number;
        quantity?: number;
        status?: string;
        cancelReason?: string;
        isPaid?: boolean;
        orderItems?: Array<{
            menuItem: string;
            quantity: number;
            price: number;
            name: string;
        }>;
    }
) => {
    try {
        await connectToDatabase();

        if (!orderId) {
            throw new Error("Order ID is required");
        }

        // Validate status if provided
        if (updateData.status) {
            const validStatuses = ['pending', 'preparing', 'served', 'cancelled'];
            if (!validStatuses.includes(updateData.status)) {
                throw new Error("Invalid status provided");
            }
        }

        const orderIds = Array.isArray(orderId) ? orderId : [orderId];
        const session = await Order.startSession();
        let updatedOrders: any[] = [];

        try {
            await session.withTransaction(async () => {
                // Batch update orders for better performance
                if (orderIds.length === 1) {
                    const updatedOrder = await Order.findByIdAndUpdate(
                        orderIds[0],
                        { $set: updateData },
                        { new: true, session }
                    )
                    .populate(getOrderPopulateConfig())
                    .lean();

                    if (!updatedOrder) {
                        throw new Error(`Order not found with ID: ${orderIds[0]}`);
                    }

                    updatedOrders.push(updatedOrder);
                } else {
                    // Bulk update for multiple orders
                    await Order.updateMany(
                        { _id: { $in: orderIds } },
                        { $set: updateData },
                        { session }
                    );

                    updatedOrders = await Order.find({ _id: { $in: orderIds } })
                        .populate(getOrderPopulateConfig())
                        .session(session)
                        .lean();
                }

                // Batch table updates
                const tableUpdates = new Map<string, any>();
                
                updatedOrders.forEach(order => {
                    if (order.table) {
                        const tableId = String(order.table._id);
                        
                        if (!tableUpdates.has(tableId)) {
                            tableUpdates.set(tableId, {
                                tableId,
                                ordersToRemove: [],
                                statusUpdate: null
                            });
                        }
                        
                        const tableUpdate = tableUpdates.get(tableId);
                        
                        if (updateData.status === 'cancelled' || updateData.isPaid) {
                            tableUpdate.ordersToRemove.push(order._id);
                        }
                        
                        // Determine table status based on remaining orders
                        if (updateData.status === 'served' || updateData.isPaid) {
                            tableUpdate.statusUpdate = 'available';
                        }
                    }
                });

                // Execute table updates
                for (const [tableId, update] of tableUpdates) {
                    const updateQuery: any = {};
                    
                    if (update.ordersToRemove.length > 0) {
                        updateQuery.$pull = { currentOrders: { $in: update.ordersToRemove } };
                    }
                    
                    // Check if table should be available after order completion
                    const table = await HotelTable.findById(tableId).session(session);
                    if (table) {
                        const remainingOrders = table.currentOrders.filter(
                            (orderId: any) => !update.ordersToRemove.includes(String(orderId))
                        );
                        
                        if (remainingOrders.length === 0) {
                            updateQuery.$set = {
                                isAvailable: true,
                                status: 'available',
                                isPaid: false
                            };
                        }
                    }
                    
                    if (Object.keys(updateQuery).length > 0) {
                        await HotelTable.findByIdAndUpdate(tableId, updateQuery, { session });
                    }
                }
            });
        } finally {
            await session.endSession();
        }

        const serializedOrders = updatedOrders.map(serializeOrder);
        
        return { 
            success: true, 
            data: orderIds.length === 1 ? serializedOrders[0] : serializedOrders 
        };

    } catch (error) {
        console.error("Error updating order:", error);
        return { success: false, error: handleError(error) };
    }
};

export const deleteOrder = async (orderId: string) => {
    try {
        await connectToDatabase();

        if (!orderId) {
            throw new Error("Order ID is required");
        }

        const session = await Order.startSession();
        let deletedOrder;

        try {
            await session.withTransaction(async () => {
                // Get order details before deletion
                deletedOrder = await Order.findById(orderId)
                    .populate(getOrderPopulateConfig())
                    .session(session)
                    .lean();

                if (!deletedOrder) {
                    throw new Error("Order not found");
                }

                // Delete the order
                await Order.findByIdAndDelete(orderId, { session });

                // Update table - remove order and potentially make available
                if (deletedOrder.table) {
                    const table = await HotelTable.findById(deletedOrder.table._id).session(session);
                    
                    if (table) {
                        const remainingOrders = table.currentOrders.filter(
                            (id: any) => String(id) !== orderId
                        );

                        const updateQuery: any = {
                            $pull: { currentOrders: orderId }
                        };

                        // If no more orders, make table available
                        if (remainingOrders.length === 0) {
                            updateQuery.$set = {
                                isAvailable: true,
                                status: 'available',
                                isPaid: false
                            };
                        }

                        await HotelTable.findByIdAndUpdate(
                            deletedOrder.table._id,
                            updateQuery,
                            { session }
                        );
                    }
                }
            });
        } finally {
            await session.endSession();
        }

        const serializedOrder = serializeOrder(deletedOrder);
        
        return { 
            success: true, 
            data: serializedOrder,
            message: "Order deleted successfully"
        };

    } catch (error) {
        console.error("Error deleting order:", error);
        return { success: false, error: handleError(error) };
    }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
    try {
        const validStatuses = ['pending', 'preparing', 'served', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid status provided");
        }

        return await updateOrder(orderId, { status });
    } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, error: handleError(error) };
    }
};

export const markOrderAsPaid = async (orderId: string) => {
    try {
        return await updateOrder(orderId, { 
            isPaid: true, 
            status: 'served' 
        });
    } catch (error) {
        console.error("Error marking order as paid:", error);
        return { success: false, error: handleError(error) };
    }
};

export const bulkUpdateOrders = async (orderIds: string[], updateData: any) => {
    try {
        if (!orderIds || orderIds.length === 0) {
            throw new Error("Order IDs are required");
        }

        return await updateOrder(orderIds, updateData);
    } catch (error) {
        console.error("Error bulk updating orders:", error);
        return { success: false, error: handleError(error) };
    }
};

export const getOrderById = async (orderId: string) => {
    try {
        await connectToDatabase();
        
        if (!orderId) {
            throw new Error("Order ID is required");
        }
        
        const order = await Order.findById(orderId)
            .populate(getOrderPopulateConfig())
            .lean();

        if (!order) {
            throw new Error("Order not found");
        }

        const serializedOrder = serializeOrder(order);

        return { success: true, data: serializedOrder };
    } catch (error) {
        console.error("Error getting order by ID:", error);
        return { success: false, error: handleError(error) };
    }
};

export const cancelOrder = async (orderId: string, cancelReason?: string) => {
    try {
        return await updateOrder(orderId, { 
            status: 'cancelled',
            cancelReason: cancelReason || 'Order cancelled by user'
        });
    } catch (error) {
        console.error("Error cancelling order:", error);
        return { success: false, error: handleError(error) };
    }
};

export const getOrderStatistics = async () => {
    try {
        await connectToDatabase();
        
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    pendingOrders: { 
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } 
                    },
                    preparingOrders: { 
                        $sum: { $cond: [{ $eq: ['$status', 'preparing'] }, 1, 0] } 
                    },
                    servedOrders: { 
                        $sum: { $cond: [{ $eq: ['$status', 'served'] }, 1, 0] } 
                    },
                    cancelledOrders: { 
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } 
                    },
                    paidOrders: { 
                        $sum: { $cond: ['$isPaid', 1, 0] } 
                    },
                    unpaidOrders: { 
                        $sum: { $cond: ['$isPaid', 0, 1] } 
                    }
                }
            }
        ]);

        const result = stats[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            preparingOrders: 0,
            servedOrders: 0,
            cancelledOrders: 0,
            paidOrders: 0,
            unpaidOrders: 0
        };

        return { success: true, data: result };
    } catch (error) {
        console.error("Error getting order statistics:", error);
        return { success: false, error: handleError(error) };
    }
};