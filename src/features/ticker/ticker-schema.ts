import { Schema } from 'mongoose';
import * as shortid from 'shortid';

export const TickerSchema = new Schema(
  {
    _id: { type: String, default: shortid.generate },
    name: { type: String },
    symbol: { type: String },
    price: { type: Number },
    timestamp: { type: Number },
  },
  { timestamps: true },
);

export const SymbolSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  name: { type: String },
  symbol: { type: String, unique: true },
});

