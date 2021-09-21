import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { CounterModule } from '../counter/counter.module';

@Module({
  imports:[MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),CounterModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports:[ProductService]
})
export class ProductModule {}
