import { Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { Transaction, TransactionDocument } from './transaction.schema';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Orderdtl } from '../../order/orderdtl/orderdtl.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(transDto: Transaction): Promise<Transaction> {
    const createdPrd = new this.transactionModel(transDto);
    return createdPrd.save();
  }
  findByProductId(prdId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ productID: prdId }).exec();
  }
}
