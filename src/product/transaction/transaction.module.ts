import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './transaction.schema';
import { CounterModule } from '../../counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    CounterModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
