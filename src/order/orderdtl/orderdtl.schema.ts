import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type OrderdtlDocument = Orderdtl & Document;

@Schema()
export class Orderdtl {
  @Prop()
  orderId: string;
  
  @Prop()
  sku: string;

  @Prop()
  name: string;

  @Prop()
  desc: string;

  @Prop({ default: 0})
  buy_price: number;

  @Prop({ default: 0})
  price: number;


  sell_price: number;

  @Prop({ default: 0})
  avail_qty: number;
  
  @Prop()
  quantity: number;

  @Prop()
  lineTotal: number;

  @Prop()
  __v: number;
  
}

export const OrderdtlSchema = SchemaFactory.createForClass(Orderdtl);
