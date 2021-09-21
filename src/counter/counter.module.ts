import { Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from './counter.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }])],
  providers: [CounterService],
  exports:[CounterService]
})
export class CounterModule {}
