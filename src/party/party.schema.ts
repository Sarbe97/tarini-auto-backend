import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type PartyDocument = Party & Document;
@Schema()
export class Party {
  @Prop()
  _id: string; //gstin

  @Prop()
  name: string;
  @Prop()
  phoneNbr: string;
  @Prop()
  gstn: string;
  @Prop()
  type: string; // CUS-customer, VEN-Vendor
}
export const PartySchema = SchemaFactory.createForClass(Party);
