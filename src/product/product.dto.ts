export class ProductDto {
  productId: string; // Product ID
  name: string;
  desc: string;
  buy_price: number;
  price: number;
  sell_price: number;
  avail_qty: number;
  uom: string;
  active: boolean;
  // Order Qty
  ord_qty: number;
}
