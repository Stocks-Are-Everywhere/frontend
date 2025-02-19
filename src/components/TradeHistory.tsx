import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TradeHistory } from '../types/tradehistory';
import axiosInstance from '../api/AxiosInstance';

const TradeHistoryList: React.FC = () => {
  const [trades, setTrades] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchTradeHistory = async () => {
  //     try {
  //       setIsLoading(true);
  //       const { data } = await axiosInstance.get('/tradehistory');
  //       console.log('Received data:', data); // 데이터 확인용 로그
  //       setTrades(data);
  //     } catch (error) {
  //       setError('거래 내역을 불러오는데 실패했습니다.');
  //       console.error('Failed to fetch trade history:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchTradeHistory();
  //   const interval = setInterval(fetchTradeHistory, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get('/tradehistory');
        console.log('Received data:', data);
        setTrades(data);
      } catch (error) {
        setError('거래 내역을 불러오는데 실패했습니다.');
        console.error('Failed to fetch trade history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradeHistory(); // 컴포넌트 마운트 시 1회만 실행
  }, []); // 빈 의존성 배열

  if (isLoading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

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
                  <Price>{trade.price?.toLocaleString() ?? '0'}원</Price>
                </PriceInfo>
                <QuantityInfo>
                  <Label>체결수량</Label>
                  <Quantity>
                    {trade.quantity?.toLocaleString() ?? '0'}주
                  </Quantity>
                </QuantityInfo>
                <TotalInfo>
                  <Label>총 체결금액</Label>
                  <TotalAmount>
                    {(
                      (trade.price ?? 0) * (trade.quantity ?? 0)
                    ).toLocaleString()}
                    원
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
  height: 600px; // 고정 높이 설정
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #8b95a1;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  padding: 20px;
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
