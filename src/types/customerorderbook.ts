export interface OrderRequest {
    side: 'buy' | 'sell';
    priceType: 'limit' | 'market';
    price: number; // priceType이 'limit'일 때만 사용
    quantity: number;
  }
  
  export const submitOrder = (order: OrderRequest): void => {
    // 여기서 실제 주문 처리 로직을 구현할 수 있습니다.
    // 예를 들어, API 호출 또는 WebSocket 연결 등
    console.log('Order submitted', order);
  };
  
  export {};
  