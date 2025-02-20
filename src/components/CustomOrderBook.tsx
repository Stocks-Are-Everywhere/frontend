import React, { useState } from 'react';
import styled from 'styled-components';
import { submitOrder } from '../services/orderService';
import { OrderRequest } from '../types/customerorderbook';

export type OrderSide = 'BUY' | 'SELL';
export type PriceType = 'limit' | 'market';

const CustomOrderBook: React.FC = () => {
  const [side, setSide] = useState<OrderSide>('BUY');
  const [priceType, setPriceType] = useState<PriceType>('limit');
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSideChange = (newSide: OrderSide) => setSide(newSide);
  const handlePriceTypeChange = (newPriceType: PriceType) => setPriceType(newPriceType);

  const handleSubmit = async () => {
    const orderRequest: OrderRequest = {
      companyCode: 'COMP002',
      type: side,
      quantity,
      price: priceType === 'limit' ? price : 0,
      userId: 1,
    };

    try {
      await submitOrder(orderRequest);
      setSuccessMessage('주문이 성공적으로 제출되었습니다.');
      setErrorMessage(null);
      // 2초 후에 성공 메시지를 숨깁니다.
      setTimeout(() => {
        setSuccessMessage(null);
      }, 1000);
    } catch (error) {
      setErrorMessage('주문 제출에 실패했습니다. 다시 시도해주세요.');
      setSuccessMessage(null);
    }
  };

  return (
    <OrderContainer>
      <Title>주문하기</Title>

      <ButtonGroup>
        <SideButton active={side === 'BUY'} $color="#333" onClick={() => handleSideChange('BUY')}>
          구매
        </SideButton>
        <SideButton active={side === 'SELL'} $color="#2d91ff" onClick={() => handleSideChange('SELL')}>
          판매
        </SideButton>
      </ButtonGroup>

      <ButtonGroup>
        <PriceTypeButton active={priceType === 'limit'} color="#444" onClick={() => handlePriceTypeChange('limit')}>
          지정가
        </PriceTypeButton>
        <PriceTypeButton active={priceType === 'market'} color="#222" onClick={() => handlePriceTypeChange('market')}>
          시장가
        </PriceTypeButton>
      </ButtonGroup>

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

      <InputGroup>
        <Label>수량</Label>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="0"
        />
      </InputGroup>

      <SubmitButton side={side} onClick={handleSubmit}>
        주문하기
      </SubmitButton>

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </OrderContainer>
  );
};

export default CustomOrderBook;

// Styled Components
const OrderContainer = styled.div`
  width: 360px;
  margin: 20px auto;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 40px rgba(0, 0, 0, 0.05);
  padding: 24px 40px 24px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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

const PriceTypeButton = styled.button<{ active: boolean; color: string }>`
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
  width: 100%;
`;

const Label = styled.label`
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
  font-size: 16px;
  color: #333;
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

const SuccessMessage = styled.div`
  margin-top: 20px;
  padding: 10px;
  color: green;
  text-align: center;
  border: 1px solid green;
  border-radius: 8px;
  background-color: #e6ffe6;
`;

const ErrorMessage = styled.div`
  margin-top: 20px;
  padding: 10px;
  color: red;
  text-align: center;
  border: 1px solid red;
  border-radius: 8px;
  background-color: #ffe6e6;
`;
