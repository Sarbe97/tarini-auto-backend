import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterModule } from '../counter/counter.module';
import { OrderdtlModule } from './orderdtl/orderdtl.module';
import { ProductModule } from '../product/product.module';
import { TransactionModule } from '../product/transaction/transaction.module';
import { PartyModule } from '../party/party.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CounterModule,
    OrderdtlModule,
    ProductModule,
    TransactionModule,
    PartyModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
