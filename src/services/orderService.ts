// src/services/orderService.ts
import { OrderRequest } from '../types/customerorderbook';

// 더미 잔액 상태 관리
let dummyBalance = 100000000;

export const submitOrder = async (orderRequest: OrderRequest): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 주문 유효성 검사
    const totalOrderAmount = orderRequest.price * orderRequest.quantity;

    // 구매 주문인 경우 잔액 확인
    if (orderRequest.type === 'BUY') {
      if (totalOrderAmount > dummyBalance) {
        return reject(new Error('잔액이 부족합니다'));
      }
      // 잔액 차감
      dummyBalance -= totalOrderAmount;
    } else {
      // 판매 주문인 경우 잔액 증가
      dummyBalance += totalOrderAmount;
    }

    // 1초 후에 성공 응답 (네트워크 지연 시뮬레이션)
    setTimeout(() => {
      console.log('주문 제출 성공:', orderRequest);
      console.log('현재 잔액:', dummyBalance);
      resolve({ success: true, message: '주문이 성공적으로 제출되었습니다.' });
    }, 1000);
  });
};

// 잔액 조회 함수
export const getBalance = (): number => {
  return dummyBalance;
};
