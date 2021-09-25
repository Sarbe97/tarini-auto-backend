import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { TransactionModule } from './transaction/transaction.module';
import { CounterModule } from '../counter/counter.module';

@Module({
  imports:[MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  CounterModule, TransactionModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports:[ProductService]
})
export class ProductModule {}
