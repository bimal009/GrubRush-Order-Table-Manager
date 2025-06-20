import { Schema, model, models, Document, Types } from 'mongoose';

export interface IReservation extends Document {
  reservationDate: Date;
  reservationTime: string; // e.g., "19:30"
  guestCount: number;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  
  
  table: Types.ObjectId; 
  user: Types.ObjectId; 
  orders: Types.ObjectId[]; 
  
  
  createdAt: Date;
  updatedAt: Date;
}

// Client-side type for populated data
export type IReservationPopulated = {
  _id: string;
  reservationDate: Date;
  reservationTime: string;
  guestCount: number;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  table: {
    _id: string;
    tableNumber: number;
    capacity: number;
    location: 'indoor' | 'outdoor';
  };
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
};

const ReservationSchema = new Schema<IReservation>(
  {
    reservationDate: {
      type: Date,
      required: true,
    },
    reservationTime: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          // Validate time format HH:MM
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Time must be in HH:MM format'
      }
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    guestInfo: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },
    specialRequests: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    
    // References
    table: {
      type: Schema.Types.ObjectId,
      ref: 'HotelTable',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orders: [{
      type: Schema.Types.ObjectId,
      ref: 'Order',
    }],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);




const Reservation = models.Reservation || model<IReservation>('Reservation', ReservationSchema);

export default Reservation;