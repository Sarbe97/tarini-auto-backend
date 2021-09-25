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

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectConnection() private connection: Connection,
    private counterService: CounterService,
    private orderdtlService: OrderdtlService,
    private productService: ProductService,
  ) {}

  async submitOrder(orderDto: Order): Promise<Order> {
    // if (orderDto._id != '' && orderDto._id !== undefined) {
    //   // saved or submitted
    //   let dbOrder = await this.orderModel
    //     .findOne({ orderId: orderDto._id })
    //     .lean();

    //   if (dbOrder != null && dbOrder.status == 'SUBMITTED') {
    //     // if submitted
    //     throw new HttpException('Can not resubmit', HttpStatus.FORBIDDEN);
    //   } else {
    //     // if  saved
    //     orderDto.status == 'SUBMITTED'; // if saved status , change to submitted
    //   }
    // } else {
    //   // if new, create new orderId
    //   let orderSeq = await this.counterService.getNextSequence('ORDER');
    //   let orderIdNxt = 'OSL' + String(orderSeq).padStart(7, '0');
    //   orderDto._id = orderIdNxt;
    // }

    // return this.saveToDB(orderDto);
    return null;
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
      let orderIdNxt = (orderDto.type == "BUY"? "OB" : "OS") + String(orderSeq).padStart(7, '0');
      newOrder._id = orderIdNxt;
    }
    newOrder.type = orderDto.type;
    newOrder.status = action == 'SAVE' ? 'SAVED' : 'SUBMITTED';

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

    let dbOrder1: Order;
    if (isOrderNew) {
      const orderPrd = new this.orderModel(newOrder);
      dbOrder1 = await orderPrd.save();
    } else {
      dbOrder1 = await this.orderModel.findByIdAndUpdate(
        newOrder._id,
        newOrder,
      );
    }
    console.log( newOrder);

    if (newOrder.status == 'SUBMITTED') {
      this.productService.syncInventory(newOrder, newOrder.type);
    }

    return this.findByOrder(newOrder._id);
  }

  // async saveToDB(orderDto: Order) {
  //   let oDetailsDto = orderDto.details;
  //   orderDto.details = [];

  //   for (let i = 0; i < oDetailsDto.length; i++) {
  //     let odtl = oDetailsDto[i];
  //     let dbPrd = await this.productService.findBySKU(odtl._id);

  //     // Create Order Details
  //     if (dbPrd != null) {
  //       let newOdtl: Orderdtl = new Orderdtl();
  //       newOdtl.orderId = orderDto._id;
  //       newOdtl.productId = dbPrd._id;
  //       newOdtl.name = dbPrd.name;
  //       newOdtl.desc = dbPrd.desc;
  //       newOdtl.buy_price = dbPrd.buy_price;
  //       newOdtl.price = dbPrd.price;
  //       newOdtl.sell_price = dbPrd.sell_price;
  //       newOdtl.avail_qty = dbPrd.avail_qty;
  //       newOdtl.quantity = odtl.quantity;
  //       newOdtl.lineTotal = dbPrd.price * odtl.quantity;

  //       let oDtlDb = await this.orderdtlService.create(newOdtl);
  //       orderDto.details.push(oDtlDb);
  //     }
  //   }
  //   const orderPrd = new this.orderModel(orderDto);
  //   let dbOrder1 = await orderPrd.save();
  //   console.log('after saving to DB');
  //   console.log(dbOrder1);
  //   return dbOrder1;
  // }

  findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findByOrder(orderId: string) {
    let orderDb = await this.orderModel
      .findById(orderId)
      .populate({ path: 'details' })
      // .populate({path:'party'})
      .lean();

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
}
