import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('trans')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @Post()
  // create(@Body() createTransactionDto: CreateTransactionDto) {
  //   return this.transactionService.create(createTransactionDto);
  // }

  // @Get()
  // findAll() {
  //   return this.transactionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.transactionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
  //   return this.transactionService.update(+id, updateTransactionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionService.remove(+id);
  // }
  // Transactions
  @Get(':prdId')
  findTransactionsByPrdId(@Param('prdId') prdId: string) {
    console.log(prdId)
    return this.transactionService.findByProductId(prdId);
  } 
}
