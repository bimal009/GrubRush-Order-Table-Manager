import { Schema, model, models, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  createdAt: Date;
  stripeId: string;
  totalAmount: string;
  table: Types.ObjectId; // Ref to HotelTable
  buyer: Types.ObjectId; // Ref to User
  estimatedServeTime?: Date | null; // Add if you want ETA here
}

// Optional client-side type
export type IOrderItem = {
  _id: string;
  totalAmount: string;
  createdAt: Date;
  tableTitle: string;
  tableId: string;
  buyer: string;
};

const OrderSchema = new Schema<IOrder>({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
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
    type: Date,
    default: null,
  }
});

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
