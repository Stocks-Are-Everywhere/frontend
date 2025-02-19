import React, { useState } from 'react';
import styled from 'styled-components';
import { TradeHistory } from '../types/tradehistory';

const TradeHistoryList: React.FC = () => {
  const [trades] = useState<TradeHistory[]>([
    {
      id: 1,
      sellOrderId: 51026,
      buyOrderId: 51026,
      quantity: 10,
      price: 3000,
    },
    {
      id: 2,
      sellOrderId: 57301,
      buyOrderId: 57301,
      quantity: 10,
      price: 1220,
    },
  ]);

  return (
    <Container>
      <Header>
        <Title>체결 내역</Title>
        <UpdateTime>
          최근 업데이트: {new Date().toLocaleTimeString()}
        </UpdateTime>
      </Header>
      <TradeWrapper>
        {trades.map((trade) => (
          <TradeItem key={trade.id}>
            <TradeHeader>
              <OrderInfo>
                <OrderNumber>#{trade.sellOrderId}</OrderNumber>
                <OrderTime>14:30:25</OrderTime>
              </OrderInfo>
              <StatusBadge>체결완료</StatusBadge>
            </TradeHeader>
            <TradeContent>
              <PriceInfo>
                <Label>체결가격</Label>
                <Price>{trade.price.toLocaleString()}원</Price>
              </PriceInfo>
              <QuantityInfo>
                <Label>체결수량</Label>
                <Quantity>{trade.quantity.toLocaleString()}주</Quantity>
              </QuantityInfo>
              <TotalInfo>
                <Label>총 체결금액</Label>
                <TotalAmount>
                  {(trade.price * trade.quantity).toLocaleString()}원
                </TotalAmount>
              </TotalInfo>
            </TradeContent>
          </TradeItem>
        ))}
      </TradeWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 360px;
  margin: 20px auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 2px 40px rgba(0, 0, 0, 0.05);
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
`;

const Header = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #191f28;
  margin: 0;
`;

const UpdateTime = styled.span`
  font-size: 12px;
  color: #8b95a1;
`;

const TradeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TradeItem = styled.div`
  background: #f9fafb;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    transform: translateY(-1px);
  }
`;

const TradeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const OrderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OrderNumber = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #4e5968;
`;

const OrderTime = styled.span`
  font-size: 12px;
  color: #8b95a1;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  background: #e7f2ff;
  color: #2d91ff;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const TradeContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const Label = styled.span`
  font-size: 12px;
  color: #8b95a1;
  display: block;
  margin-bottom: 4px;
`;

const PriceInfo = styled.div``;

const Price = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #191f28;
`;

const QuantityInfo = styled.div``;

const Quantity = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #191f28;
`;

const TotalInfo = styled.div``;

const TotalAmount = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #191f28;
`;

export default TradeHistoryList;
