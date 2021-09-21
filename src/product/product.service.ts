import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { Counter, CounterDocument } from '../counter/counter.schema';
import { CounterService } from '../counter/counter.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection,
    private counterService: CounterService,
  ) {}

  getNextSeq() {
    return this.counterService.getNextSequence('PRODUCT');
  }

  create(productDto: Product): Promise<Product> {
    // let nextSeq = this.counterService.getNextSequence('PRODUCT');
    // let productId= "PRD"+String(nextSeq).padStart(7,'0');
    // productDto.sku = productId;
    // productDto._id = productDto.sku;
    const createdPrd = new this.productModel(productDto);
    return createdPrd.save();
  }

  findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  findOne(id: number) {
    return this.productModel.findById(id);
  }

  search(txt: string) {
    return this.productModel
      .find({
        $or: [
          { sku: { $regex: txt, $options: 'i' } },
          { name: { $regex: txt, $options: 'i' } },
        ],
      })
      .exec();
  }

  findBySKU(sku: string) {
    return this.productModel.findOne({ sku: sku }).exec();
  }

  update(id: string, productDto: Product) {
    return this.productModel.findByIdAndUpdate(id, productDto);
    // return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return this.productModel.remove(id);
  }
}
