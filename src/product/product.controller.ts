import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {  Product } from './product.schema';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() productDto: Product) {
    console.log('Create');
    console.log(productDto)
    return this.productService.create(productDto);
  }

  @Get()
  findAll() {
    console.log('get');
    return this.productService.findAll();
  }

  @Get('key')
  key() {
    console.log('key')
    return this.productService.getNextSeq();
  }

  @Get('search/:qry')
  search(@Param('qry') qry: string) {
    console.log(qry);
    return this.productService.search(qry);
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productService.findOne(+id);
  // }

  @Get(':sku')
  findBySKU(@Param('sku') sku: string) {
    console.log(sku)
    return this.productService.findByProductId(sku);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() productDto: Product) {
    console.log(id);
    console.log(productDto);
    return this.productService.update(id, productDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  

}
