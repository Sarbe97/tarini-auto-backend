import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.schema';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAllOrder() {
    return this.orderService.findAll();
  }
  @Get(':orderId')
  findOrder(@Param('orderId')orderId:string) {
    return this.orderService.findByOrder(orderId);
  }
  @Post("/sell/submit")
  submitOrder(@Body() order:Order){
    console.log(order)
    order.status = "SUBMITTED"
    order.type = "SELL"
    return this.orderService.create(order);
  }
  @Post("/sell/save")
  saveOrder(@Body() order:Order){
    order.status = "SAVED"
    order.type = "SELL"
    return this.orderService.create(order);
  }

  // Transactions
  // @Get('transactions')
  // findAllTransactions() {
  //   return this.transactionsService.findAll();
  // }

  // @Get(':id/transactions')
  // findAllInventoryTransactions() {
  //   return this.transactionsService.findAll();
  // }
}
