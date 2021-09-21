import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CounterService } from '../counter/counter.service';
import { OrderdtlService } from './orderdtl/orderdtl.service';
import { Orderdtl } from './orderdtl/orderdtl.schema';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectConnection() private connection: Connection,
    private counterService: CounterService,
    private orderdtlService: OrderdtlService,
    private productService: ProductService,
  ) {}

  async create(orderDto: Order): Promise<Order> {
    let orderSeq = await this.counterService.getNextSequence('ORDER');
    let orderIdNxt = 'OSL' + String(orderSeq).padStart(7, '0');

    orderDto.orderId = orderIdNxt;
    let oDetailsDto = orderDto.details;
    orderDto.details = [];

    for (let i = 0; i < oDetailsDto.length; i++) {
      let odtl = oDetailsDto[i];
      let dbPrd = await this.productService.findBySKU(odtl.sku);

      // Create Order Details
      if (dbPrd != null) {
        let newOdtl: Orderdtl = new Orderdtl();
        newOdtl.orderId = orderIdNxt; //dbOrder.orderId;
        newOdtl.sku = dbPrd.sku;
        newOdtl.name = dbPrd.name;
        newOdtl.desc = dbPrd.desc;
        newOdtl.buy_price = dbPrd.buy_price;
        newOdtl.price = dbPrd.price;
        newOdtl.sell_price = dbPrd.sell_price;
        newOdtl.avail_qty = dbPrd.avail_qty;
        newOdtl.quantity = odtl.quantity;
        newOdtl.lineTotal = dbPrd.price * odtl.quantity;

        let oDtlDb = await this.orderdtlService.create(newOdtl);
        orderDto.details.push(oDtlDb);
      }
    }
    const orderPrd = new this.orderModel(orderDto);
    let dbOrder = await orderPrd.save();
    return dbOrder;
  }

  findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findByOrder(orderId: string) {
    let orderDb = await this.orderModel
      .findOne({ orderId: orderId })
      .populate({ path: 'details' })
      .lean();

    let orderDtls = orderDb.details;

    orderDb.details = [];
    let dbPrd: Product;
    for (let i = 0; i < orderDtls.length; i++) {
      let newOdtl = orderDtls[i];
      dbPrd = await this.productService.findBySKU(newOdtl.sku);
      //const odtl = {...dbPrd, quantity:orderDtls[i].quantity};

      newOdtl.buy_price = dbPrd.buy_price;
      newOdtl.price = dbPrd.price;
      newOdtl.sell_price = dbPrd.sell_price;
      newOdtl.avail_qty = dbPrd.avail_qty;

      orderDb.details.push(newOdtl);
    }
    return orderDb;
  }
}
