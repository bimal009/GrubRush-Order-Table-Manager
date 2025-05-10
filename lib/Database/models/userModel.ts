import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },  // Removed unique constraint
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  photo: { type: String, required: true },
  // Add fallback properties with default values
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  // Add timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const User = models.User || model("User", userSchema);
export default User;