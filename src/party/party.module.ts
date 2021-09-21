import { Module } from '@nestjs/common';
import { PartyService } from './party.service';
import { PartyController } from './party.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Party, PartySchema } from './party.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Party.name, schema: PartySchema }])],
  controllers: [PartyController],
  providers: [PartyService]
})
export class PartyModule {}
