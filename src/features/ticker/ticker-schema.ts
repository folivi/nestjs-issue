import { Schema } from 'mongoose';

export const TickerSchema = new Schema({
  name: { type: String },
  symbol: { type: String },
  price: { type: Number },
  timestamp: { type: Number },
});
