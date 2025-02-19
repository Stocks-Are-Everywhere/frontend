import React, { useState } from 'react';
import styled from 'styled-components';

// 주문 종류 및 가격 타입 정의
type OrderSide = 'buy' | 'sell';
type PriceType = 'limit' | 'market';

const CustomOrderBook: React.FC = () => {
  const [side, setSide] = useState<OrderSide>('buy');
  const [priceType, setPriceType] = useState<PriceType>('limit');
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const handleSideChange = (newSide: OrderSide) => {
    setSide(newSide);
  };

  const handlePriceTypeChange = (newPriceType: PriceType) => {
    setPriceType(newPriceType);
  };

  const handleSubmit = async () => {
    // 백엔드 요청에 필요한 데이터 설정 (필요에 따라 수정)
    const orderRequest = {
      companyCode: "COMP001",    // 회사 코드 (예시: COMP001)
      type: side,                // 'buy' 또는 'sell'
      quantity: quantity,
      price: priceType === 'limit' ? price : 0, // 시장가의 경우 price는 0 또는 null 처리
      userId: 1           // 사용자 ID (가상의 유저 ID)  
    };

    try {
      // API 요청 보내기
      await fetch('http://localhost:8080/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderRequest)
      });
    } catch (error) {
      console.error('주문 요청 중 에러 발생:', error);
    }
  };

  return (
    <OrderContainer>
      <Title>주문하기</Title>
      
      {/* 1) 구매/판매 */}
      <ButtonGroup>
        <SideButton active={side === 'buy'} $color="#333" onClick={() => handleSideChange('buy')}>
          구매
        </SideButton>
        <SideButton active={side === 'sell'} $color="#2d91ff" onClick={() => handleSideChange('sell')}>
          판매
        </SideButton>
      </ButtonGroup>

      {/* 2) 지정가/시장가 */}
      <ButtonGroup>
        <PriceTypeButton active={priceType === 'limit'} color="#444" onClick={() => handlePriceTypeChange('limit')}>
          지정가
        </PriceTypeButton>
        <PriceTypeButton active={priceType === 'market'} color="#222" onClick={() => handlePriceTypeChange('market')}>
          시장가
        </PriceTypeButton>
      </ButtonGroup>

      {/* 3) 가격 (지정가인 경우만) */}
      {priceType === 'limit' && (
        <InputGroup>
          <Label>가격</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="0"
          />
        </InputGroup>
      )}

      {/* 4) 수량 */}
      <InputGroup>
        <Label>수량</Label>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="0"
        />
      </InputGroup>

      {/* 주문 버튼 */}
      <SubmitButton side={side} onClick={handleSubmit}>
        주문하기
      </SubmitButton>
    </OrderContainer>
  );
};

// Styled Components
const OrderContainer = styled.div`
  width: 360px;
  margin: 20px auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 2px 40px rgba(0, 0, 0, 0.05);
  padding: 24px;
  padding-right: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
`;

const Title = styled.h3`
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 700;
  color: #333;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SideButton = styled.button<{ active: boolean; $color: string }>`
  flex: 1;
  margin: 0 5px;
  padding: 12px 0;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: ${(props) => (props.active ? props.$color : 'transparent')};
  color: ${(props) => (props.active ? '#fff' : '#666')};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? props.$color : '#f0f0f0')};
    transform: scale(1.05);
    color: #fff;
  }
`;

const PriceTypeButton = styled.button<{ active: boolean; color?: string }>`
  flex: 1;
  margin: 0 5px;
  padding: 12px 0;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: ${(props) => (props.active ? props.color : 'transparent')};
  color: ${(props) => (props.active ? '#fff' : '#666')};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? props.color : '#f0f0f0')};
    transform: scale(1.05);
    color: #fff;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #f8f9fa;
  color: #333;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button<{ side: OrderSide }>`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background: skyblue;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #87cefa;
    transform: translateY(-5px);
  }
`;

export default CustomOrderBook;
