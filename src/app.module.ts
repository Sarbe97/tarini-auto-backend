import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { PartyModule } from './party/party.module';
import { CounterModule } from './counter/counter.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://storeadmin:xxxxxxxxx@tarinicluster0.mnxhs.mongodb.net/autostore?retryWrites=true&w=majority',
      {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
    ),
    ProductModule,
    OrderModule,
    PartyModule,
    CounterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
