import { Injectable } from '@nestjs/common';
import { CounterService } from './counter/counter.service';
import { TransactionService } from './product/transaction/transaction.service';
import { ProductService } from './product/product.service';
import { OrderService } from './order/order.service';
import { OrderdtlService } from './order/orderdtl/orderdtl.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    // private orderdtlService: OrderdtlService,
    @InjectConnection() private connection: Connection,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
  async reset() {
  //  await this.orderdtlService.removeMany();
    // this.connection.db.dropCollection("orderDtls");
    // this.connection.db.dropCollection("orders");
    // this.connection.db.dropCollection("products");
  }
}
