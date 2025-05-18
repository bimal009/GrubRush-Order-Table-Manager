import { Document, Schema, model, models, Types } from "mongoose";

export interface IHotelTable extends Document {
  tableNumber: number;
  capacity: number;
  location: 'indoor' | 'outdoor';
  isAvailable: boolean;
  isReserved: boolean;
  isPaid: boolean;
  status: 'idle' | 'processing' | 'completed'; // NEW FIELD
  currentOrder?: Types.ObjectId;
  estimatedServeTime?: Date; // NEW FIELD
  reservedBy?: Types.ObjectId;
}

const hotelTableSchema = new Schema<IHotelTable>({
  tableNumber: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  location: { type: String, enum: ['indoor', 'outdoor'], default: 'indoor' },
  isAvailable: { type: Boolean, default: true },
  isReserved: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false },

  status: { type: String, enum: ['idle', 'processing', 'completed'], default: 'idle' }, // NEW
  estimatedServeTime: { type: Date, default: null }, // NEW

  reservedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  currentOrder: { type: Schema.Types.ObjectId, ref: 'Order', default: null },
}, { timestamps: true });

const HotelTable = models.HotelTable || model<IHotelTable>('HotelTable', hotelTableSchema);

export default HotelTable;
