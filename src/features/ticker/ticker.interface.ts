import { Document } from 'mongoose';

export interface Ticker extends Document {
  name: string;
  symbol: string;
  price: number;
  timestamp: number;
}
