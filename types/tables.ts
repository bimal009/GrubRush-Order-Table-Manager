import { IOrder } from "@/lib/Database/models/orderModel";
import { Types } from "mongoose";

export type TableStatus = "Available" | "Reserved" | "Occupied";
export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

export interface Table {
  _id?: string;
  tableNo: number;
  isAvailable: boolean;
  tableStatus: TableStatus;
  orderStatus: OrderStatus;
  amount: number;
}

export type HotelTable = {
  _id: string;
  tableNumber: number;
  capacity: number;
  location: 'indoor' | 'outdoor';
  isAvailable: boolean;
  isReserved: boolean;
  isPaid: boolean;
  status: 'pending' | 'preparing' | 'served' | 'cancelled';
  currentOrders: string[];
  estimatedServeTime?: string | null;
  reservedBy: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
};

export type CreateTableParams = {
  tableNumber: number;
  capacity: number;
  location: 'indoor' | 'outdoor';
  isAvailable?: boolean;
  isReserved?: boolean;
  isPaid?: boolean;
  status?: 'pending' | 'preparing' | 'served' | 'cancelled';
  currentOrders?: string[];
  estimatedServeTime?: string | null;
  reservedBy?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
};

export type SerializedHotelTable = {
  _id: string;
  tableNumber: number;
  capacity: number;
  location: 'indoor' | 'outdoor';
  isAvailable: boolean;
  isReserved: boolean;
  isPaid: boolean;
  status: 'pending' | 'preparing' | 'served' | 'cancelled';
  estimatedServeTime: string | null;
  reservedBy: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TableWithOrder = {
  _id: Types.ObjectId;
  tableNumber: number;
  capacity: number;
  location: 'indoor' | 'outdoor';
  isAvailable: boolean;
  isReserved: boolean;
  isPaid: boolean;
  status: 'pending' | 'preparing' | 'served' | 'cancelled';
  currentOrders: IOrder[] | null;
  reservedBy: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
  createdAt?: Date;
  updatedAt?: Date;
}

