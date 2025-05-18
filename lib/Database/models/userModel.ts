import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  photo: { type: String, required: true },

  // Relations
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],            // Orders placed by user
  reservedTables: [{ type: Schema.Types.ObjectId, ref: 'HotelTable' }], // Tables user has reserved
}, { timestamps: true });

// Compile model
const User = models.User || model("User", userSchema);

export default User;
