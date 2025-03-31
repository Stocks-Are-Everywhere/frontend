// src/services/orderService.ts
import { OrderRequest } from '../types/customerorderbook';
import orderAxiosInstance from '../api/OrderAxiosInstance';

// 더미 잔액 상태 관리
let dummyBalance = 100000000;

export const submitOrder = async (orderRequest: OrderRequest) => {
  const response = await orderAxiosInstance.post<void>(
    `/api/order`, orderRequest, {
      headers: {
        'Authorization': localStorage.getItem('jwt')
      }
    }
  );
  return response;
}


// 잔액 조회 함수
export const getBalance = (): number => {
  return dummyBalance;
};
