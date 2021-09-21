import { SchemaFactory } from '@nestjs/mongoose';
export class Party {}
export const PartySchema = SchemaFactory.createForClass(Party);
