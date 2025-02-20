// OrderBook.tsx
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import WebSocketService from '../services/WebSocketService';
import { OrderBookData, PriceLevel } from '../types/orderbook';

const OrderBook: React.FC = () => {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const prevOrderBook = useRef<OrderBookData | null>(null);
  const prevPrice = useRef<number | null>(null); // 이전 가격 저장용
  const webSocketService = WebSocketService.getInstance();

  // 가격 변동 추적
  const getPriceChange = (
    current: PriceLevel,
    previous: PriceLevel | undefined
  ) => {
    if (!previous) return 'none';
    if (current.price > previous.price) return 'increase';
    if (current.price < previous.price) return 'decrease';
    return 'none';
  };

  // 수량 변동 추적
  const getQuantityChange = (
    current: PriceLevel,
    previous: PriceLevel | undefined
  ) => {
    if (!previous) return 'none';
    if (current.quantity > previous.quantity) return 'increase';
    if (current.quantity < previous.quantity) return 'decrease';
    return 'none';
  };

  // 수량 퍼센티지 계산
  const getQuantityPercentage = (quantity: number) => {
    const MAX_QUANTITY = 10000; // 적절한 최대값 설정
    return Math.min((quantity / MAX_QUANTITY) * 100, 100);
  };

  // 현재가 계산 함수 (askLevels, bidLevels가 없으면 기본값([]) 사용)
  const calculateCurrentPrice = (data: Partial<OrderBookData>): number | null => {
    const askLevels = data.askLevels ?? [];
    const bidLevels = data.bidLevels ?? [];
    if (askLevels.length === 0 || bidLevels.length === 0) return null;
    // 매도는 오름차순(최저가가 첫번째), 매수는 내림차순(최고가가 첫번째)라고 가정
    const bestAskPrice = askLevels[0].price;
    const bestBidPrice = bidLevels[0].price;
    return Math.floor((bestAskPrice + bestBidPrice) / 2);
  };

  // 툴팁 내용을 포맷팅
  const formatTooltipContent = (orderCount: number) => {
    return `총 ${orderCount.toLocaleString()}건`;
  };

  // 현재가 변경 감지 및 애니메이션 적용
  useEffect(() => {
    if (
      orderBook?.currentPrice &&
      prevPrice.current !== null &&
      orderBook.currentPrice !== prevPrice.current
    ) {
      const priceElement = document.querySelector('.current-price');
      if (priceElement) {
        priceElement.classList.add('price-changed');
        setTimeout(() => {
          priceElement.classList.remove('price-changed');
        }, 500);
      }
    }
    prevPrice.current = orderBook?.currentPrice ?? null;
  }, [orderBook?.currentPrice]);

  useEffect(() => {
    webSocketService.connect();
    webSocketService.subscribe('/topic/orderbook/005930', (data: any) => {
      // 백엔드에서 단일 주문 업데이트 메시지를 보내는 경우
      if (data.orderId) {
        const newOrder = data;
        setOrderBook((prevBook) => {
          let newBook: OrderBookData;
          if (prevBook) {
            newBook = { ...prevBook };
          } else {
            newBook = {
              companyCode: newOrder.companyCode,
              currentPrice: 0,
              prevPrice: 0,
              askLevels: [],
              bidLevels: []
            };
          }
          // 주문 종류에 따라 해당 호가 배열 업데이트
          if (newOrder.type === 'BUY') {
            const index = newBook.bidLevels.findIndex(
              (level) => level.price === newOrder.price
            );
            if (index > -1) {
              const updatedLevel = { ...newBook.bidLevels[index] };
              updatedLevel.quantity += newOrder.quantity;
              updatedLevel.orderCount += 1;
              newBook.bidLevels[index] = updatedLevel;
            } else {
              newBook.bidLevels.push({
                price: newOrder.price,
                quantity: newOrder.quantity,
                orderCount: 1
              });
            }
            // 내림차순 정렬 (최고가가 첫번째)
            newBook.bidLevels.sort((a, b) => b.price - a.price);
          } else if (newOrder.type === 'SELL') {
            const index = newBook.askLevels.findIndex(
              (level) => level.price === newOrder.price
            );
            if (index > -1) {
              const updatedLevel = { ...newBook.askLevels[index] };
              updatedLevel.quantity += newOrder.quantity;
              updatedLevel.orderCount += 1;
              newBook.askLevels[index] = updatedLevel;
            } else {
              newBook.askLevels.push({
                price: newOrder.price,
                quantity: newOrder.quantity,
                orderCount: 1
              });
            }
            // 오름차순 정렬 (최저가가 첫번째)
            newBook.askLevels.sort((a, b) => a.price - b.price);
          }
          // 현재가 갱신
          const newCurrentPrice = calculateCurrentPrice(newBook);
          newBook.prevPrice = newBook.currentPrice;
          newBook.currentPrice = newCurrentPrice ?? 0;
          prevOrderBook.current = prevBook;
          return newBook;
        });
      } else {
        // 전체 주문서 스냅샷 형태일 경우 기존 로직 사용 (참고용)
        const currentPrice = calculateCurrentPrice(data);
        const prevPriceValue = prevOrderBook.current
          ? calculateCurrentPrice(prevOrderBook.current)
          : currentPrice;
        const enrichedData: OrderBookData = {
          ...data,
          currentPrice: currentPrice ?? 0,
          prevPrice: prevPriceValue ?? 0
        };
        prevOrderBook.current = orderBook;
        setOrderBook(enrichedData);
      }
    });

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  if (!orderBook) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Header>
        <CompanyInfo>
          <CompanyCode>{orderBook.companyCode}</CompanyCode>
          <CompanyName>삼성전자</CompanyName>
        </CompanyInfo>
      </Header>

      <OrderBookWrapper>
        <AskLevels>
          {orderBook.askLevels.map((level, index) => {
            const prevLevel = prevOrderBook.current?.askLevels[index];
            const priceChange = getPriceChange(level, prevLevel);
            const quantityChange = getQuantityChange(level, prevLevel);

            return (
              <PriceLevelRow key={`ask-${index}`}>
                <QuantityBar
                  type="ask"
                  width={getQuantityPercentage(level.quantity)}
                />
                <PriceLevelContent>
                  <Quantity changed={quantityChange}>
                    {level.quantity.toLocaleString()}
                    <QuantityTooltip>{`${level.orderCount}건`}</QuantityTooltip>
                  </Quantity>
                  <Price type="ask" changed={priceChange}>
                    {level.price.toLocaleString()}
                  </Price>
                </PriceLevelContent>
              </PriceLevelRow>
            );
          })}
        </AskLevels>

        <CurrentPriceSection>
          <CurrentPriceWrapper>
            <CurrentPrice
              className="current-price"
              type={
                (orderBook?.currentPrice ?? 0) > (orderBook?.prevPrice ?? 0)
                  ? 'up'
                  : (orderBook?.currentPrice ?? 0) < (orderBook?.prevPrice ?? 0)
                  ? 'down'
                  : 'same'
              }
            >
              {orderBook?.currentPrice?.toLocaleString() ?? '-'}
            </CurrentPrice>
            <PriceChangeInfo>
              <ChangeAmount
                type={
                  (orderBook?.currentPrice ?? 0) > (orderBook?.prevPrice ?? 0)
                    ? 'up'
                    : (orderBook?.currentPrice ?? 0) < (orderBook?.prevPrice ?? 0)
                    ? 'down'
                    : 'same'
                }
              >
                {(orderBook?.currentPrice ?? 0) - (orderBook?.prevPrice ?? 0)}
              </ChangeAmount>
              <ChangePercent
                type={
                  (orderBook?.currentPrice ?? 0) > (orderBook?.prevPrice ?? 0)
                    ? 'up'
                    : (orderBook?.currentPrice ?? 0) < (orderBook?.prevPrice ?? 0)
                    ? 'down'
                    : 'same'
                }
              >
                {(
                  (((orderBook?.currentPrice ?? 0) - (orderBook?.prevPrice ?? 0)) /
                    (orderBook?.prevPrice ?? 1)) *
                  100
                ).toFixed(2)}
                %
              </ChangePercent>
            </PriceChangeInfo>
          </CurrentPriceWrapper>
        </CurrentPriceSection>

        <Divider />

        <BidLevels>
          {orderBook.bidLevels.map((level, index) => {
            const prevLevel = prevOrderBook.current?.bidLevels[index];
            const priceChange = getPriceChange(level, prevLevel);
            const quantityChange = getQuantityChange(level, prevLevel);

            return (
              <PriceLevelRow key={`bid-${index}`}>
                <QuantityBar
                  type="bid"
                  width={getQuantityPercentage(level.quantity)}
                />
                <PriceLevelContent>
                  <Quantity changed={quantityChange}>
                    {level.quantity.toLocaleString()}
                    <QuantityTooltip>
                      {formatTooltipContent(level.orderCount)}
                    </QuantityTooltip>
                  </Quantity>
                  <Price type="bid" changed={priceChange}>
                    {level.price.toLocaleString()}
                  </Price>
                </PriceLevelContent>
              </PriceLevelRow>
            );
          })}
        </BidLevels>
      </OrderBookWrapper>
    </Container>
  );
};

// Styled Components

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

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CompanyCode = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const CompanyName = styled.span`
  font-size: 14px;
  color: #666;
`;

const OrderBookWrapper = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  overflow: hidden;
`;

const PriceLevelRow = styled.div`
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
`;

const PriceLevelContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span<{
  type: 'ask' | 'bid';
  changed: 'increase' | 'decrease' | 'none';
}>`
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => {
    switch (props.type) {
      case 'ask':
        return '#ff5454';
      case 'bid':
        return '#2d91ff';
      default:
        return '#333';
    }
  }};
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  ${(props) => {
    switch (props.changed) {
      case 'increase':
        return `
          background-color: rgba(45, 145, 255, 0.1);
          transform: scale(1.05);
        `;
      case 'decrease':
        return `
          background-color: rgba(255, 84, 84, 0.1);
          transform: scale(1.05);
        `;
      default:
        return '';
    }
  }}
`;

const Quantity = styled.span<{ changed: 'increase' | 'decrease' | 'none' }>`
  font-size: 14px;
  color: #666;
  position: relative;
  padding: 4px 8px;
  transition: all 0.3s ease;
  cursor: help;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  ${(props) => {
    switch (props.changed) {
      case 'increase':
        return `
          color: #2d91ff;
          font-weight: bold;
          transform: scale(1.05);
        `;
      case 'decrease':
        return `
          color: #ff5454;
          font-weight: bold;
          transform: scale(1.05);
        `;
      default:
        return '';
    }
  }}
`;

const QuantityTooltip = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -40px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 10;
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6px;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(0, 0, 0, 0.8);
  }
  ${Quantity}:hover & {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px);
  }
`;

const QuantityBar = styled.div<{
  type: 'ask' | 'bid';
  width: number;
}>`
  position: absolute;
  top: 0;
  right: ${(props) => (props.type === 'ask' ? 0 : 'auto')};
  left: ${(props) => (props.type === 'bid' ? 0 : 'auto')};
  height: 100%;
  width: ${(props) => props.width}%;
  background: ${(props) =>
    props.type === 'ask'
      ? 'rgba(255, 84, 84, 0.1)'
      : 'rgba(45, 145, 255, 0.1)'};
  transition: width 0.3s ease;
`;

const AskLevels = styled.div`
  display: flex;
  flex-direction: column;
`;

const BidLevels = styled.div`
  display: flex;
  flex-direction: column-reverse;
`;

const CurrentPriceSection = styled.div`
  padding: 16px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;

const CurrentPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const CurrentPrice = styled.div<{ type: 'up' | 'down' | 'same' }>`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => {
    switch (props.type) {
      case 'up':
        return '#ff5454';
      case 'down':
        return '#2d91ff';
      default:
        return '#333';
    }
  }};
  transition: all 0.3s ease;
  &.price-changed {
    animation: priceBlink 0.5s ease;
  }
  @keyframes priceBlink {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const PriceChangeInfo = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ChangeAmount = styled.span<{ type: 'up' | 'down' | 'same' }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => {
    switch (props.type) {
      case 'up':
        return '#ff5454';
      case 'down':
        return '#2d91ff';
      default:
        return '#333';
    }
  }};
`;

const ChangePercent = styled(ChangeAmount)`
  &::before {
    content: '(';
  }
  &::after {
    content: ')';
  }
`;

const Divider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid #eee;
`;

export default OrderBook;
