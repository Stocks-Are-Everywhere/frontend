export interface OrderRequest {
  companyCode: string;
  type: 'LIMIT_BUY' | 'LIMIT_SELL' | 'MARKET_BUY' | 'MARKET_SELL';
  totalQuantity: number;
  price: number;
  userId: number;
}
