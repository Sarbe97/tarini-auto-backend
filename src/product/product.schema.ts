import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  _id: string; // Product ID

  // @Prop()
  // sku: string;

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
  uom: string;

  @Prop({ default: false })
  active: boolean;

  @Prop({ default: new Date() })
  created: Date;

  @Prop({ default: new Date() })
  updated: Date;


  @Prop({select:false})
  __v: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
