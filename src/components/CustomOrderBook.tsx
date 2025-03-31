import React, { useState } from 'react';
import styled from 'styled-components';
import { submitOrder } from '../services/orderService';
import { OrderRequest } from '../types/customerorderbook';
import eventBus from '../util/eventbus';
import { CompanySearchResponse } from '../types/CompanySearchResponse';

export type OrderType = 'BUY' | 'SELL';
export type OrderSide = 'LIMIT_BUY' | 'LIMIT_SELL' | 'MARKET_BUY' | 'MARKET_SELL';
export type PriceType = 'limit' | 'market';

interface OrderBookProps {
  companyData: CompanySearchResponse;
}

const CustomOrderBook: React.FC<OrderBookProps> = ({ companyData }) => {
  const [side, setSide] = useState<OrderSide>('LIMIT_BUY');
  const [type, setType] = useState<OrderType>('BUY');
  const [priceType, setPriceType] = useState<PriceType>('limit');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1'); // 기본값 1로 설정
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSideChange = (newSide: OrderSide) => setSide(newSide);
  const handlePriceTypeChange = (newPriceType: PriceType) => {
    setPriceType(newPriceType);
    // 시장가 선택 시 가격 입력 필드 초기화
    if (newPriceType === 'market') {
      setPrice('');
    }
  };
  const handleTypeChange = (newType: OrderType) => setType(newType);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setPrice(value);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleSubmit = async () => {
    // 입력값 유효성 검사
    if (priceType === 'limit' && (price === '' || parseInt(price) <= 0)) {
      setErrorMessage('유효한 가격을 입력해주세요');
      return;
    }

    if (quantity === '' || parseInt(quantity) <= 0) {
      setErrorMessage('유효한 수량을 입력해주세요');
      return;
    }

    const orderRequest: OrderRequest = {
      companyCode: companyData.isuSrtCd,
      type: side,
      totalQuantity: parseInt(quantity),
      price: priceType === 'limit' ? parseInt(price) : 0,
      userId: 1,
    };

    try {
      const response = await submitOrder(orderRequest);
      if(response.status == 200) {
        setSuccessMessage('주문이 성공적으로 제출되었습니다.');
        setErrorMessage(null);
      } else {
        setErrorMessage(response.statusText);
      }


      eventBus.publish('newTrade', {
        id: Math.floor(Math.random() * 10000),
        sellOrderId: Math.floor(Math.random() * 10000),
        buyOrderId: Math.floor(Math.random() * 10000),
        price: priceType === 'limit' ? parseInt(price) : 0,
        quantity: parseInt(quantity),
      });

      // 주문 성공 후 입력 필드 초기화 (선택사항)
      if (priceType === 'limit') {
        setPrice('');
      }
      setQuantity('1');

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
        <SideButton
          active={type === 'BUY'}
          $color="#333"
          onClick={() => {
            handleTypeChange('BUY')
            if (priceType === 'limit') {
              handleSideChange('LIMIT_BUY');
            } else {
              handleSideChange('MARKET_BUY');
            }
          }}
        >
          구매
        </SideButton>
        <SideButton
          active={type === 'SELL'}
          $color="#2d91ff"
          onClick={() => {
            handleTypeChange("SELL")
            if (priceType === 'limit') {
              handleSideChange('LIMIT_SELL');
            } else {
              handleSideChange('MARKET_SELL');
            }
          }}
        >
          판매
        </SideButton>
      </ButtonGroup>

      <ButtonGroup>
        <PriceTypeButton
          active={priceType === 'limit'}
          color="#444"
          onClick={() => {
            handlePriceTypeChange('limit')
            if (type === 'BUY') {
              handleSideChange('LIMIT_BUY');
            } else {
              handleSideChange('LIMIT_SELL');
            }
          }}
        >
          지정가
        </PriceTypeButton>
        <PriceTypeButton
          active={priceType === 'market'}
          color="#222"
          onClick={() => {
            handlePriceTypeChange('market')
            if (type === 'BUY') {
              handleSideChange('MARKET_BUY');
            } else {
              handleSideChange('MARKET_SELL');
            }
          }}
        >
          시장가
        </PriceTypeButton>
      </ButtonGroup>

      {priceType === 'limit' && (
        <InputGroup>
          <Label>가격</Label>
          <Input
            type="text"
            value={price}
            onChange={handlePriceChange}
            placeholder="가격을 입력하세요"
          />
        </InputGroup>
      )}

      <InputGroup>
        <Label>수량</Label>
        <Input
          type="text"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="수량을 입력하세요"
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
  background: #5294f3;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #5294f3;
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
