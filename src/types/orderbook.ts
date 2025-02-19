export interface PriceLevel {
  price: number;
  quantity: number;
  orderCount: number;
}

export interface OrderBookData {
  companyCode: string;
  currentPrice: number;
  prevPrice: number;
  sellLevels: PriceLevel[];
  buyLevels: PriceLevel[];
}
