import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Counter, CounterDocument } from './counter.schema';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async getNextSequence(key: string) {
    console.log(key);
    let counter = await this.counterModel.findOneAndUpdate(
      { key: key },
      { $inc: { seq: 1 } },
      { new: true }
    );
    console.log(counter.seq)
    return counter.seq;
  }
}
