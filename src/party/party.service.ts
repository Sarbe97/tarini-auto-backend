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

  create(partyDto: Party): Promise<Party> {
    partyDto._id = partyDto.gstn;
    console.log(partyDto)
    const partyMdl = new this.partyModel(partyDto);
    return partyMdl.save();
  }

  findByGstn(gstn: string) {
    return this.partyModel.findById(gstn).exec();
  }

  findAll() {
    return this.partyModel.find().exec();
  }
}
