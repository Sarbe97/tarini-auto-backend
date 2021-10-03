import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { Transaction, TransactionDocument } from './transaction.schema';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Orderdtl } from '../../order/orderdtl/orderdtl.schema';
import { CounterService } from '../../counter/counter.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectConnection() private connection: Connection,
    private counterService: CounterService,
  ) {}

  async create(transDto: Transaction): Promise<Transaction> {
    let nextSeq = await this.counterService.getNextSequence('TRANS');
    let transId = 'T' + String(nextSeq).padStart(10, '0');
    transDto._id = transId;
    transDto.created = new Date();
    transDto.updated = new Date();
    const createdPrd = new this.transactionModel(transDto);
    return createdPrd.save();
  }
  findByProductId(prdId: string): Promise<Transaction[]> {
    return this.transactionModel
      .find({ productId: prdId })
      .sort({ _id: -1 })
      .exec();
  }

  findByDate() {
    return this.transactionModel.find().exec();
  }

  async removeMany() {
    await this.transactionModel.deleteMany({ __v: { $gte: 0 } });
  }
}
