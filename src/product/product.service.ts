import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { Counter, CounterDocument } from '../counter/counter.schema';
import { CounterService } from '../counter/counter.service';
import { Orderdtl } from '../order/orderdtl/orderdtl.schema';
import { Order } from '../order/order.schema';
import { TransactionService } from './transaction/transaction.service';
import {
  TransactionDocument,
  Transaction,
} from './transaction/transaction.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection,
    private counterService: CounterService,
    private transactionService: TransactionService,
  ) {}

  getNextSeq() {
    return this.counterService.getNextSequence('PRODUCT');
  }

  async create(productDto: Product): Promise<Product> {
    let nextSeq = await this.counterService.getNextSequence('PRODUCT');
    let productId = 'PRD' + String(nextSeq).padStart(7, '0');
    productDto._id = productId;
    const createdPrd = new this.productModel(productDto);

    let prdDb = await createdPrd.save();

    // Transacrions
    let trans: Transaction = new Transaction();
    trans.productID = prdDb._id;
    trans.orderId = '';
    trans.cur_qty = 0;
    trans.prev_qty = 0;
    trans.buy_price = prdDb.buy_price;
    trans.price = prdDb.price;
    trans.sell_price = prdDb.sell_price;
    trans.type = 'ENTRY';

    this.transactionService.create(trans);
    return prdDb;
  }

  findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // findOne(id: number) {
  //   return this.productModel.findById(id);
  // }

  search(txt: string) {
    return this.productModel
      .find({
        $or: [
          { sku: { $regex: txt, $options: 'i' } },
          { name: { $regex: txt, $options: 'i' } },
        ],
      })
      .exec();
  }

  findByProductId(id: string) {
    return this.productModel.findById(id).exec();
  }

  update(id: string, productDto: Product) {
    return this.productModel.findByIdAndUpdate(id, productDto);
    // return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return this.productModel.remove(id);
  }

  async syncInventory(order: Order, type: string) {
    console.log("Type: "+type)
    const oDetails = order.details;
    for (let i = 0; i < oDetails.length; i++) {
      let dtl = oDetails[i];
      let qty = type == 'BUY' ? dtl.ord_qty : -oDetails[i].ord_qty;
      let dbPrd = await this.productModel
        .findOneAndUpdate({ _id: dtl.productId }, { $inc: { avail_qty: qty } })
        .exec();

      let trans: Transaction = new Transaction();
      trans.productID = dtl.productId;
      trans.orderId = order._id;
      trans.prev_qty = dtl.avail_qty;
      trans.cur_qty = dbPrd.avail_qty;
      trans.buy_price = dtl.buy_price;
      trans.price = dtl.price;
      trans.sell_price = dtl.sell_price;
      trans.type = type;
      // Add to transactions
      this.transactionService.create(trans);
    }
  }

  transactionsById(prdId: string) {
    return this.transactionService.findByProductId(prdId);
  }
}
