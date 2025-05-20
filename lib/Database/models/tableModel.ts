import { Schema, model, models, Document, Types } from 'mongoose';
import { IOrder } from './orderModel';

export interface IHotelTable extends Document {
  tableNumber: number;
  capacity: number;
  location: 'indoor' | 'outdoor';
  isAvailable: boolean;
  isReserved: boolean;
  isPaid: boolean;
  status: 'idle' | 'processing' | 'completed';
  currentOrder?: Types.ObjectId | IOrder | null;
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
    isPaid: { type: Boolean, required: true },
    status: { type: String, enum: ['idle', 'processing', 'completed'], required: true },
    currentOrder: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    reservedBy: {
      type: Schema.Types.Mixed,
      default: null,
      required: false
    }
  },
  { timestamps: true }
);

// Pre-save middleware to handle empty reservedBy
HotelTableSchema.pre('save', function(next) {
  if (this.reservedBy && !this.reservedBy.name) {
    this.reservedBy = null;
  }
  next();
});

const HotelTable = models.HotelTable || model<IHotelTable>('HotelTable', HotelTableSchema);

export default HotelTable;
