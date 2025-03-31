import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TradeHistory } from '../types/tradehistory';
import axiosInstance from '../api/AxiosInstance';
import eventbus from '../util/eventbus';
import { CompanySearchResponse } from '../types/CompanySearchResponse';
import orderAxiosInstance from '../api/OrderAxiosInstance';
import { EventSourcePolyfill } from 'event-source-polyfill';

interface OrderBookProps {
  companyData: CompanySearchResponse;
}

const TradeHistoryList: React.FC<OrderBookProps> = ({ companyData }) => {
  const [trades, setTrades] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const convertEpochToKST = (epochTime: number) => {
    const date = new Date(epochTime); // epochTime이 밀리초 단위여야 합니다.
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    try {
      if(localStorage.getItem('jwt') != null) {
        const fetchSse = async () => {
          const eventSource = new EventSourcePolyfill(
            `${process.env.REACT_APP_ORDER_API_URL}/api/histories/stream`,
            {
              headers: {
                "Content-Type": "text/event-stream",
                "Authorization" : '' + localStorage.getItem('jwt')
              },
              heartbeatTimeout: 60 * 60 * 60 * 60
            }
          );
  
          eventSource.addEventListener("MatchingNotificationDto", (event) => {
            console.log(event);
          });

          eventSource.onmessage = async (e) => {
            const res = await e.data;
            const parsedData = JSON.parse(res);
      
            console.log(parsedData);
            console.log(convertEpochToKST(parsedData.createdAt))
            addNewTrade({
              orderId: parsedData.orderId,
              companyCode: parsedData.companyCode,
              type: parsedData.type,
              quantity: parsedData.quantity,
              price: parsedData.price,
              createdAt: convertEpochToKST(parsedData.createdAt)
            });
          };
        };
        fetchSse();
      }
    } catch (error) {
      throw error;
  }
  })

  const addNewTrade = (newTrade: TradeHistory) => {
    setTrades((prevTrades) => [newTrade, ...prevTrades]);
  };

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        setIsLoading(true);
        const { data } = await orderAxiosInstance.get('/histories', {
          headers: {
            'Authorization': localStorage.getItem("jwt")
          }
        });
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

  const formatDate = (dateString: String) => {
    return dateString.replace("T", " ").slice(0, 16);
  };

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
            <TradeItem key={`${trade.orderId}-${trade.createdAt}`}>
              <TradeHeader>
                <OrderInfo>
                  <OrderNumber>#{trade.orderId}</OrderNumber>
                  <OrderTime>{formatDate(trade.createdAt)}</OrderTime>
                </OrderInfo>
                <StatusBadge>{trade.type.includes("SELL") ? "매도" : "매수"}</StatusBadge>
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
  height: 420px; // 고정 높이 설정
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
