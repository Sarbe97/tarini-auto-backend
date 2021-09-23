import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Party, PartyDocument } from './party.schema';

@Injectable()
export class PartyService {
  constructor(
    @InjectModel(Party.name) private partyModel: Model<PartyDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  create(party: Party): Promise<Party> {
    const partyMdl = new this.partyModel(party);
    return partyMdl.save();
  }

  findOne(id: number) {
    return this.partyModel.findById(id);
  }
}
