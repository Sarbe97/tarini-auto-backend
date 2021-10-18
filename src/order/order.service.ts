import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CounterService } from '../counter/counter.service';
import { OrderdtlService } from './orderdtl/orderdtl.service';
import { Orderdtl } from './orderdtl/orderdtl.schema';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.schema';
import { OrderDto } from './order.dto';
import { TransactionService } from '../product/transaction/transaction.service';
import { PartyService } from '../party/party.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectConnection() private connection: Connection,
    private counterService: CounterService,
    private orderdtlService: OrderdtlService,
    private productService: ProductService,
    private transactionService: TransactionService,
    private partyService: PartyService,
  ) {}

  async reset() {
    await this.productService.removeMany();
    await this.orderdtlService.removeMany();
    await this.removeMany();
    await this.orderdtlService.removeMany();
    await this.transactionService.removeMany();
    // await this.connection.db.dropCollection("orderDtls");
    // await this.connection.db.dropCollection("orders");
    // await this.connection.db.dropCollection("transactions");
  }

  async saveOrder(orderDto: OrderDto, action: string): Promise<Order> {
    console.log('saveOrder');
    console.log(orderDto._id);
    let newOrder: Order = new Order();

    newOrder.details = [];

    let isOrderNew: Boolean = false;
    if (orderDto._id != '' && orderDto._id !== undefined) {
      console.log(1);
      isOrderNew = false;
      // saved or submitted
      let dbOrder = await this.orderModel.findById(orderDto._id).lean();
      console.log(dbOrder);
      if (dbOrder != null && dbOrder.status == 'SUBMITTED') {
        // if submitted
        console.log(2);
        throw new HttpException('Can not resubmit', HttpStatus.FORBIDDEN);
      } else {
        console.log(3);
        // if  saved
        newOrder._id = orderDto._id;

        // clear details if present for already saved
        this.orderdtlService.removeDetailsByOrderId(orderDto._id);
      }
    } else {
      console.log(4);
      // if new, create new orderId
      isOrderNew = true;
      let orderSeq = await this.counterService.getNextSequence('ORDER');
      let orderIdNxt =
        (orderDto.type == 'BUY' ? 'OB' : 'OS') +
        String(orderSeq).padStart(7, '0');
      newOrder._id = orderIdNxt;
      newOrder.created = new Date();
    }
    newOrder.type = orderDto.type;
    newOrder.status = action == 'SAVE' ? 'SAVED' : 'SUBMITTED';
    newOrder.updated = new Date();
    // Party Details

    // newOrder.party = orderDto.party;
    console.log(orderDto.party);
    let partyDtl = await this.partyService.findByGstn(orderDto.party);
    newOrder.party = partyDtl;

    let subTotal = 0;
    for (let i = 0; i < orderDto.details.length; i++) {
      let itemDto = orderDto.details[i];
      let dbPrd = await this.productService.findByProductId(itemDto.productId);

      // Create Order Details
      if (dbPrd != null) {
        let newOdtl: Orderdtl = new Orderdtl();
        newOdtl._id = newOrder._id + '_' + i;
        newOdtl.orderId = newOrder._id;
        newOdtl.productId = dbPrd._id;
        newOdtl.name = dbPrd.name;
        newOdtl.desc = dbPrd.desc;
        newOdtl.buy_price = dbPrd.buy_price;
        newOdtl.price = dbPrd.price;
        newOdtl.sell_price = dbPrd.sell_price;
        newOdtl.gst = dbPrd.gst;
        newOdtl.avail_qty = dbPrd.avail_qty;
        newOdtl.ord_qty = itemDto.ord_qty;
        newOdtl.uom = dbPrd.uom;
        newOdtl.lineTotal = dbPrd.sell_price * itemDto.ord_qty;
        subTotal += newOdtl.lineTotal;
        //Save to DB
        let oDtlDb = await this.orderdtlService.create(newOdtl);
        newOrder.details.push(oDtlDb);
      }
    }

    newOrder.subTotal = subTotal;
    // newOrder.party = orderDto.party;

    // let dbOrder1: Order;
    if (isOrderNew) {
      const orderPrd = new this.orderModel(newOrder);
      newOrder = await orderPrd.save();
    } else {
      newOrder = await this.orderModel.findByIdAndUpdate(
        newOrder._id,
        newOrder,
        { returnDocument: 'after' },
      );
    }
    newOrder = await this.findOrder(newOrder._id);
    console.log(newOrder);

    if (newOrder.status == 'SUBMITTED') {
      this.productService.syncInventory(newOrder, newOrder.type);
    }

    return newOrder;
  }

  findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }
  findOrderById(orderId: string) {
    return this.orderModel.findById(orderId)
      .populate({ path: 'details' })
      .populate({ path: 'party' })
      .lean();
  }

  async findOrder(orderId: string) {
    let orderDb = await this.findOrderById(orderId);
    if (orderDb.status != 'SUBMITTED') {
      // let orderDtlsDb = orderDb.details;
      // orderDb.details = [];
      let dbPrd: Product;
      for (let i = 0; i < orderDb.details.length; i++) {
        let newOdtl = orderDb.details[i];
        dbPrd = await this.productService.findByProductId(newOdtl.productId);
        if (dbPrd != null) {
          newOdtl.buy_price = dbPrd.buy_price;
          newOdtl.price = dbPrd.price;
          newOdtl.sell_price = dbPrd.sell_price;
          newOdtl.avail_qty = dbPrd.avail_qty;
        }
      }
    }
    // console.log('Fetched again: ');

    console.log(orderDb);
    return orderDb;
  }

  async removeMany() {
    await this.orderModel.deleteMany({ __v: { $gte: 0 } });
  }
}
