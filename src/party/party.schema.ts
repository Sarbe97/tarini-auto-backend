import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type PartyDocument = Party & Document;
@Schema()
export class Party {
  @Prop()
  name: string;
  @Prop()
  phoneNbr: string;
  @Prop()
  gstNbr: string;
}
export const PartySchema = SchemaFactory.createForClass(Party);
