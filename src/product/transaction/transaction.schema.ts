import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type TransactionDocument = Transaction & Document;
@Schema()
export class Transaction {

  @Prop()
  _id: string; // Product ID

  @Prop()
  productId: string;

  @Prop()
  orderId: string;

  @Prop()
  prev_qty: number;

  @Prop()
  ord_qty: number;

  @Prop()
  cur_qty: number;

  @Prop()
  buy_price: number;

  @Prop()
  price: number;

  @Prop()
  sell_price: number;

  @Prop()
  type: string;

  @Prop()
  created: Date;

  @Prop()
  updated: Date;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
