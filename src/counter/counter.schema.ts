import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type CounterDocument = Counter & Document;

@Schema()
export class Counter {
  @Prop()
  key: string;

  @Prop()
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
