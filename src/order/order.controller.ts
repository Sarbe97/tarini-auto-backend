import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.schema';
import { OrderDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAllOrder() {
    return this.orderService.findAll();
  }
  @Get(':orderId')
  findOrder(@Param('orderId') orderId: string) {
    return this.orderService.findByOrder(orderId);
  }
  @Post('/sell/submit')
  submitOrder(@Body() orderDto: Order) {
    console.log("Submit Order");
    console.log(orderDto)
    // orderDto.status = 'SUBMITTED';
    orderDto.type = 'SELL';
    return this.orderService.submitOrder(orderDto);
  }

  @Post('/sell/save')
  saveOrder(@Body() orderDto: OrderDto) {
    console.log("Save Order");
    console.log(orderDto)
    // orderDto.status = 'SAVED';
    orderDto.type = 'SELL';
    return this.orderService.saveOrder(orderDto,"SAVE");
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
