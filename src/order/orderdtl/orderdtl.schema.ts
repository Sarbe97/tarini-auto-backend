import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type OrderdtlDocument = Orderdtl & Document;

@Schema()
export class Orderdtl {
  @Prop()
  _id: string; //orderDtl

  @Prop({ type: String, ref: 'Party' })
  orderId: string;
  
  @Prop()
  productId: string;

  @Prop()
  name: string;

  @Prop()
  desc: string;

  @Prop({ default: 0 })
  buy_price: number;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  sell_price: number;

  @Prop({ default: 0 })
  avail_qty: number;

  @Prop()
  ord_qty: number;
  
  @Prop()
  uom: string;

  @Prop()
  lineTotal: number;

  @Prop()
  __v: number;
}

export const OrderdtlSchema = SchemaFactory.createForClass(Orderdtl);
