import { Schema, model, models, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  createdAt: Date;
  totalAmount: string;
  table: Types.ObjectId; // Ref to HotelTable
  buyer: Types.ObjectId; // Ref to User
  estimatedServeTime?: number | null; // Add if you want ETA here
  quantity: number;
}

// Optional client-side type
export type IOrderItem = {
  _id: string;
  totalAmount: string;
  createdAt: Date;
  tableTitle: string;
  tableId: string;
  buyer: string;
  estimatedServeTime?: number | null;
  quantity: number;
};

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

});

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
