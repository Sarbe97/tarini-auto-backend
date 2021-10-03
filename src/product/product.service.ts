import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Mongoose } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CounterService } from '../counter/counter.service';
import { Order } from '../order/order.schema';
import { TransactionService } from './transaction/transaction.service';
import { Transaction } from './transaction/transaction.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection,
    private counterService: CounterService,
    private transactionService: TransactionService,
  ) {}

  async create(productDto: Product): Promise<Product> {
    let nextSeq = await this.counterService.getNextSequence('PRODUCT');
    let productId = 'PRD' + String(nextSeq).padStart(7, '0');
    productDto._id = productId;
    productDto.created = new Date();
    productDto.updated = new Date();
    const createdPrd = new this.productModel(productDto);

    let prdDb = await createdPrd.save();

    // Transactions
    let trans: Transaction = new Transaction();
    trans.productId = prdDb._id;
    trans.orderId = '';
    trans.cur_qty = 0;
    trans.prev_qty = 0;
    trans.ord_qty = 0;
    trans.buy_price = prdDb.buy_price;
    trans.price = prdDb.price;
    trans.sell_price = prdDb.sell_price;
    trans.type = 'INITIAL';

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
    productDto.updated = new Date();
    return this.productModel.findByIdAndUpdate(id, productDto);
    // return `This action updates a #${id} product`;
  }

  async updateQuantity(qty: number, productId: string) {
    // return await this.productModel
    //   .findOneAndUpdate(
    //     { _id: productId },
    //       { $inc: { avail_qty: qty } },
    //       { returnDocument: 'after' },
    //   )
    //   .exec();

      let dbPrd = await this.findByProductId(productId);
      dbPrd.avail_qty += qty;
      dbPrd.updated = new Date();

      this.update(productId, dbPrd);
      dbPrd = await dbPrd.save();
      return dbPrd;
  }

  remove(id: number) {
    return this.productModel.remove(id);
  }

  async syncInventory(order: Order, type: string) {
    console.log('Type: ' + type);
    console.log(order);
    const oDetails = order.details;

    for (let i = 0; i < oDetails.length; i++) {
      let dtl = oDetails[i];
      let qty = type == 'BUY' ? dtl.ord_qty : -dtl.ord_qty;
      console.log('Before: ' + dtl.avail_qty);
      let dbPrd = await this.productModel
        .findOneAndUpdate(
          { _id: dtl.productId },
          { $inc: { avail_qty: qty } },
          { returnDocument: 'after' },
        )
        .exec();
      console.log('After: ' + dbPrd.avail_qty);
      let trans: Transaction = new Transaction();
      trans.productId = dtl.productId;
      trans.orderId = order._id;
      trans.prev_qty = dtl.avail_qty;
      trans.ord_qty = dtl.ord_qty;
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

  async removeMany() {
    await this.productModel.deleteMany({ __v: { $gte: 0 } });
  }
}
