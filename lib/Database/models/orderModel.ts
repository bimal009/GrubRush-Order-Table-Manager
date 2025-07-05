import { Schema, model, models, Document, Types } from 'mongoose';

export interface IOrderItem extends Document {
  _id: Types.ObjectId;
  menuItem: Types.ObjectId; // Reference to MenuItem
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  estimatedServeTime?: number;
}

export interface IOrder extends Document {
  createdAt: Date;
  totalAmount: string;
  table: Types.ObjectId; // Ref to HotelTable
  buyer: Types.ObjectId; // Ref to User
  estimatedServeTime?: number | null; // Add if you want ETA here
  quantity: number;
  status: 'pending' | 'preparing' | 'served' | 'cancelled';
  isPaid: boolean;
  orderItems: IOrderItem[];
}

// Optional client-side type
export type ClientOrderItem = {
  _id: string;
  totalAmount: string;
  createdAt: Date;
  tableTitle: string;
  tableId: string;
  buyer: string;
  estimatedServeTime?: number | null;
  quantity: number;
};

const OrderItemSchema = new Schema<IOrderItem>({
  menuItem: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  specialInstructions: {
    type: String,
    default: "",
  },
  estimatedServeTime: {
    type: Number,
    default: null,
  },
});

const OrderSchema = new Schema<IOrder>({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: String,
  },
  table: {
    type: Schema.Types.ObjectId,
    ref: 'HotelTable',
    required: true,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  estimatedServeTime: {
    type: Number,
    default: null,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'served', 'cancelled'],
    default: 'pending',
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  orderItems: [OrderItemSchema],
});

// Force model recompilation by deleting existing model
if (models.Order) {
  delete models.Order;
}

const Order = model<IOrder>('Order', OrderSchema);

export default Order;
