import { Document, Schema, model, models } from "mongoose";

export interface IEvent extends Document {
  _id: string;
  title: string;
  isAvailable: boolean;
}

const tableSchema = new Schema({
  title: { type: String, required: true },
  isAvailable: { type: Boolean, default: false },
})

const Table = models.Table || model('Table', tableSchema);

export default Table;