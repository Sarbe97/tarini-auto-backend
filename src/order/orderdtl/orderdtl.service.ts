import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Orderdtl, OrderdtlDocument } from './orderdtl.schema';

@Injectable()
export class OrderdtlService {
  constructor(
    @InjectModel(Orderdtl.name) private orderdtlModel: Model<OrderdtlDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  create(odtl: Orderdtl): Promise<Orderdtl> {
    const createdPrd = new this.orderdtlModel(odtl);
    return createdPrd.save();
  }

  findAllByOrder(orderId: string): Promise<Orderdtl[]> {
    return this.orderdtlModel.find().exec();
  }

  findOne(id: number) {
    return this.orderdtlModel.findById(id);
  }
}
