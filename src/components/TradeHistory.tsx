// src/components/TradeHistoryList.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TradeHistory } from '../types/tradehistory';
import WebSocketService from '../services/WebSocketService';

const TradeHistoryList: React.FC = () => {
  const [trades, setTrades] = useState<TradeHistory[]>([]);

  useEffect(() => {
    const webSocketService = WebSocketService.getInstance();
    webSocketService.connect();

    // 웹소켓 채널에 체결 데이터를 구독합니다.
    webSocketService.subscribe('/topic/trades', (data: any) => {
      // data가 체결 데이터 형식을 갖추었는지 확인 후 state 업데이트
      if (
        typeof data.price === 'number' &&
        typeof data.quantity === 'number' &&
        data.tradeDateTime
      ) {
        setTrades(prevTrades => [data, ...prevTrades]); // 최신 체결 데이터를 상단에 추가
      }
    });

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  return (
    <Container>
      <Header>
        <Title>체결 내역</Title>
        <UpdateTime>
          최근 업데이트: {new Date().toLocaleTimeString()}
        </UpdateTime>
      </Header>
      <ScrollableWrapper>
        <TradeWrapper>
          {trades.map((trade, index) => (
            <TradeItem key={index}>
              <TradeHeader>
                <TradeDate>{trade.tradeDateTime}</TradeDate>
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
      </ScrollableWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 360px;
  height: 420px;
  margin: 20px auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 2px 40px rgba(0, 0, 0, 0.05);
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  display: flex;
  flex-direction: column;
`;

const ScrollableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;
  }
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
  padding-right: 8px;
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

const TradeDate = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #4e5968;
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
