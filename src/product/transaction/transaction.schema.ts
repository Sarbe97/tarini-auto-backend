import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type TransactionDocument = Transaction & Document;
@Schema()
export class Transaction {
  @Prop()
  productId: string;

  @Prop()
  orderId: string;

  @Prop()
  prev_qty: number;

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

  

  @Prop({ default: new Date() })
  created: Date;

  @Prop({ default: new Date() })
  updated: Date;

  
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
