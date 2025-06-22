import { Schema, model, models, Document, Types } from 'mongoose';
import { IOrder } from './orderModel';

export interface IHotelTable extends Document {
  tableNumber: number;
  capacity: number;
  location: 'indoor' | 'outdoor';
  isAvailable: boolean;
  isReserved: boolean;
  isPaid: boolean;
  status: 'pending' | 'preparing' | 'served' | 'cancelled';
  currentOrders: Types.ObjectId[] | IOrder[] | null;
  reservedBy?: {
    name?: string;
    email?: string;
    phone?: string;
  } | null;
}

const HotelTableSchema = new Schema<IHotelTable>(
  {
    tableNumber: { type: Number, required: true },
    capacity: { type: Number, required: true },
    location: { type: String, enum: ['indoor', 'outdoor'], required: true },
    isAvailable: { type: Boolean, required: true },
    isReserved: { type: Boolean, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    status: { type: String, enum: ['pending', 'preparing', 'served', 'cancelled'], required: true },
    currentOrders: [{
      type: Schema.Types.ObjectId,
      ref: 'Order',
      default: [],
    }],
    reservedBy: {
      type: Schema.Types.Mixed,
      default: null,
      required: false
    },
    
  },
  { 
    timestamps: true,
    ...({ strictPopulate: false } as any)
  }
);



const HotelTable = models.HotelTable || model("HotelTable", HotelTableSchema);

export default HotelTable;
