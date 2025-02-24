export interface OrderRequest {
  companyCode: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  userId: number;
}
