import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.schema';
import { OrderDto } from './order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('reset/:reset')
  async resetData(@Param('reset') reset: string) {
    console.log('resetData');
    await this.orderService.reset();
    return 'Success';
  }

  @Get()
  findAllOrder() {
    return this.orderService.findAll();
  }
  @Get(':orderId')
  findOrder(@Param('orderId') orderId: string) {
    return this.orderService.findByOrder(orderId);
  }
  @Post('/sell/submit')
  submitOrder(@Body() orderDto: OrderDto) {
    console.log('Submit Order');
    console.log(orderDto);
    // orderDto.status = 'SUBMITTED';
    orderDto.type = 'SELL';
    return this.orderService.saveOrder(orderDto, 'SUBMIT');
  }

  @Post('/sell/save')
  saveOrder(@Body() orderDto: OrderDto) {
    console.log('Save Order');
    console.log(orderDto);
    // orderDto.status = 'SAVED';
    orderDto.type = 'SELL';
    return this.orderService.saveOrder(orderDto, 'SAVE');
  }

  @Post('/buy/submit')
  submitBuyOrder(@Body() orderDto: OrderDto) {
    console.log('Submit Order');
    console.log(orderDto);
    orderDto.type = 'BUY';
    return this.orderService.saveOrder(orderDto, 'SUBMIT');
  }

  @Post('/buy/save')
  saveBuyOrder(@Body() orderDto: OrderDto) {
    console.log('Save Order');
    console.log(orderDto);
    orderDto.type = 'BUY';
    return this.orderService.saveOrder(orderDto, 'SAVE');
  }
}
