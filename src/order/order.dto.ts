import { ProductDto } from "src/product/product.dto";
import { Party } from '../party/party.schema';

export class OrderDto {
  _id: string; //OrderId
  subTotal: number;
  type: string; //SELL/BUY
  status: string; // SAVED,SUBMITTED
  party: Party;
  details: ProductDto[];
}
