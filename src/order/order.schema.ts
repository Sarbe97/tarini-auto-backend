import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Party } from 'src/party/party.schema';
import { Orderdtl } from './orderdtl/orderdtl.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
 
  @Prop()
  orderId: string;

  @Prop()
  subTotal: number;

  @Prop()
  type: string; //SELL/BUY

  @Prop()
  status: string; // SAVED,SUBMITTED

  @Prop({ default: new Date() })
  created: Date;

  @Prop({ default: new Date() })
  updated: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Party' })
  party: Party;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orderdtl' }],
  })
  details: Orderdtl[];

  @Prop({ select: false })
  __v: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
