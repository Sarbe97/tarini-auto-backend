import { Module } from '@nestjs/common';
import { OrderdtlService } from './orderdtl.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orderdtl, OrderdtlSchema } from './orderdtl.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Orderdtl.name, schema: OrderdtlSchema }])],
  providers: [OrderdtlService],
  exports:[OrderdtlService]
})
export class OrderdtlModule {}
