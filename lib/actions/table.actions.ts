"use server"

import { CreateTableParams, SerializedHotelTable, TableWithOrder } from "@/types/tables"
import { handleError } from "../utils"
import { connectToDatabase } from "../Database/MongoDb"
import HotelTable from "../Database/models/tableModel"
import { IOrder } from "../Database/models/orderModel"

const serializeTable = (table: TableWithOrder): SerializedHotelTable => ({
    _id: table._id.toString(),
    tableNumber: table.tableNumber,
    capacity: table.capacity,
    location: table.location,
    isAvailable: table.isAvailable,
    isReserved: table.isReserved,
    isPaid: table.isPaid,
    status: table.status,
    estimatedServeTime: table.currentOrder?.estimatedServeTime?.toISOString() || null,
    reservedBy: table.reservedBy ? {
        name: table.reservedBy.name,
        email: table.reservedBy.email,
        phone: table.reservedBy.phone
    } : null,
    createdAt: table.createdAt?.toISOString(),
    updatedAt: table.updatedAt?.toISOString(),
});

export const createTable = async (data: CreateTableParams): Promise<SerializedHotelTable> => {
    try {
        await connectToDatabase();
        if (!data) throw new Error("Missing required table data");

        const newTable = await HotelTable.create(data);
        return serializeTable(newTable.toObject({ getters: true }) as TableWithOrder);
    } catch (error) {
        throw new Error(handleError(error));
    }
};

export const getTable = async (): Promise<SerializedHotelTable[]> => {
    try {
        await connectToDatabase();
        const tables = await HotelTable.find()
            .populate<{ currentOrder: IOrder | null }>("currentOrder")
            .lean();

        return ((tables as unknown) as TableWithOrder[]).map(serializeTable);
    } catch (error) {
        throw new Error(handleError(error));
    }
};

export const deleteTable = async (tableId: string): Promise<SerializedHotelTable> => {
    try {
        await connectToDatabase();
        if (!tableId) throw new Error("Table ID is required");

        const deletedTable = await HotelTable.findByIdAndDelete(tableId).lean() as unknown as TableWithOrder;
        if (!deletedTable) throw new Error("Table not found");

        return serializeTable(deletedTable);
    } catch (error) {
        throw new Error(handleError(error));
    }
};


export const markAvailable = async (tableId: string): Promise<SerializedHotelTable> => {
    try {
        await connectToDatabase();
        if (!tableId) throw new Error("Table ID is required");

        const table = await HotelTable.findByIdAndUpdate(tableId, { isAvailable: true, reservedBy: null, isReserved: false, isPaid: false, status: "idle" }, { new: true }).lean() as unknown as TableWithOrder;
        if (!table) throw new Error("Table not found");

        return serializeTable(table);   
    } catch (error) {
        throw new Error(handleError(error));
    }
}

export const markUnavailable = async (tableId: string): Promise<SerializedHotelTable> => {
    try {
        await connectToDatabase();
        if (!tableId) throw new Error("Table ID is required");

        const table = await HotelTable.findByIdAndUpdate(tableId, { isAvailable: false, reservedBy: null, isReserved: true, isPaid: false, status: "idle" }, { new: true }).lean() as unknown as TableWithOrder;
        if (!table) throw new Error("Table not found");

        return serializeTable(table);   
    } catch (error) {
        throw new Error(handleError(error));
    }
}