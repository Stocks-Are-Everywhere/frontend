// src/components/OrderBook.tsx

import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import WebSocketService from '../services/WebSocketService';
import { OrderBookData, PriceLevel } from '../types/orderbook';
// 체결 데이터 관련 타입은 그대로 유지 (나중에 사용 가능)
import { TradeData } from '../types/TradeOrder';

const OrderBook: React.FC = () => {
  // 호가 데이터
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  // 체결 데이터 목록 (추후 필요 시 활용)
  const [tradeList, setTradeList] = useState<TradeData[]>([]);

  // 이전 호가 스냅샷
  const prevOrderBook = useRef<OrderBookData | null>(null);
  // 이전 가격
  const prevPrice = useRef<number | null>(null);

  // WebSocket 싱글턴
  const webSocketService = WebSocketService.getInstance();

  // 가격 변동 추적
  const getPriceChange = (
    current: PriceLevel,
    previous: PriceLevel | undefined
  ): 'increase' | 'decrease' | 'none' => {
    if (!previous) return 'none';
    if (current.price > previous.price) return 'increase';
    if (current.price < previous.price) return 'decrease';
    return 'none';
  };

  // 수량 변동 추적 (totalQuantity 사용)
  const getQuantityChange = (
    current: PriceLevel,
    previous: PriceLevel | undefined
  ): 'increase' | 'decrease' | 'none' => {
    if (!previous) return 'none';
    if (current.totalQuantity > previous.totalQuantity) return 'increase';
    if (current.totalQuantity < previous.totalQuantity) return 'decrease';
    return 'none';
  };

  // 수량 퍼센티지 계산
  const getQuantityPercentage = (totalQuantity: number) => {
    const MAX_QUANTITY = 10000; // 적절한 최대값 설정
    return Math.min((totalQuantity / MAX_QUANTITY) * 100, 100);
  };

  /**
   * 현재가 계산 함수
   * - sellLevels에서 가장 낮은 매도가: sellLevels[sellLevels.length - 1]
   * - buyLevels에서 가장 높은 매수가: buyLevels[0]
   */
  const calculateCurrentPrice = (data: any): number | null => {
    const sellLevels: PriceLevel[] = data.sellLevels ?? [];
    const buyLevels: PriceLevel[] = data.buyLevels ?? [];
    if (sellLevels.length === 0 || buyLevels.length === 0) return null;
    const bestSellPrice = sellLevels[sellLevels.length - 1].price;
    const bestBuyPrice = buyLevels[0].price;
    return Math.floor((bestSellPrice + bestBuyPrice) / 2);
  };

  // 툴팁 내용 포맷팅
  const formatTooltipContent = (orderCount: number) => {
    return `총 ${orderCount.toLocaleString()}건`;
  };

  // 현재가 변경 감지 -> 애니메이션 적용
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

  // WebSocket 연결 & 데이터 수신
  useEffect(() => {
    webSocketService.connect();

    webSocketService.subscribe('/topic/orderbook/005930', (data: any) => {
      // 연결 성공 메시지
      if (data.message === 'WebSocket connection successful') {
        return;
      }

      // 1) 호가 데이터인 경우(sellLevels나 buyLevels가 있으면)
      if (data.sellLevels || data.buyLevels) {
        const currentPrice = calculateCurrentPrice(data);
        const prevPriceValue = prevOrderBook.current
          ? calculateCurrentPrice(prevOrderBook.current)
          : currentPrice;

        const enrichedData: OrderBookData = {
          ...data,
          sellLevels: data.sellLevels ?? [],
          buyLevels: data.buyLevels ?? [],
          currentPrice: currentPrice ?? 0,
          prevPrice: prevPriceValue ?? 0,
        };

        prevOrderBook.current = orderBook;
        setOrderBook(enrichedData);
      }
      // 2) 체결 데이터인 경우 (현재는 처리하지 않고 pass)
      else if (
        typeof data.price === 'number' &&
        typeof data.quantity === 'number' &&
        data.tradeDateTime
      ) {
        // 체결 데이터 수신은 유지하되, 화면에 렌더링하지 않음
        setTradeList((prev) => [...prev, data]);
      }
    });

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  // 주문서가 없으면 로딩
  if (!orderBook) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Header>
        <CompanyInfo>
          <CompanyCode>{orderBook.companyCode}</CompanyCode>
        </CompanyInfo>
      </Header>

      <OrderBookWrapper>
        {/* 매도 호가 (sellLevels) */}
        <AskLevels>
          {orderBook.sellLevels.map((level, index) => {
            const prevLevel = prevOrderBook.current?.sellLevels[index];
            const priceChange = getPriceChange(level, prevLevel);
            const quantityChange = getQuantityChange(level, prevLevel);

            return (
              <PriceLevelRow key={`sell-${index}`}>
                <QuantityBar
                  type="ask"
                  width={getQuantityPercentage(level.totalQuantity)}
                />
                <PriceLevelContent>
                  <Quantity changed={quantityChange}>
                    {level.totalQuantity.toLocaleString()}
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

        {/* 현재가 영역 */}
        <CurrentPriceSection>
          <CurrentPriceWrapper>
            <CurrentPrice
              className="current-price"
              type={
                (orderBook.currentPrice ?? 0) > (orderBook.prevPrice ?? 0)
                  ? 'up'
                  : (orderBook.currentPrice ?? 0) < (orderBook.prevPrice ?? 0)
                  ? 'down'
                  : 'same'
              }
            >
              {orderBook.currentPrice.toLocaleString()}
            </CurrentPrice>
            <PriceChangeInfo>
              <ChangeAmount
                type={
                  (orderBook.currentPrice ?? 0) >
                  (orderBook.prevPrice ?? 0)
                    ? 'up'
                    : (orderBook.currentPrice ?? 0) < (orderBook.prevPrice ?? 0)
                    ? 'down'
                    : 'same'
                }
              >
                {(
                  (orderBook.currentPrice ?? 0) -
                  (orderBook.prevPrice ?? 0)
                ).toLocaleString()}
              </ChangeAmount>
              <ChangePercent
                type={
                  (orderBook.currentPrice ?? 0) >
                  (orderBook.prevPrice ?? 0)
                    ? 'up'
                    : (orderBook.currentPrice ?? 0) < (orderBook.prevPrice ?? 0)
                    ? 'down'
                    : 'same'
                }
              >
                {(
                  (((orderBook.currentPrice ?? 0) -
                    (orderBook.prevPrice ?? 0)) /
                    (orderBook.prevPrice ?? 1)) *
                  100
                ).toFixed(2)}
                %
              </ChangePercent>
            </PriceChangeInfo>
          </CurrentPriceWrapper>
        </CurrentPriceSection>

        <Divider />

        {/* 매수 호가 (buyLevels) */}
        <BidLevels>
          {orderBook.buyLevels.map((level, index) => {
            const prevLevel = prevOrderBook.current?.buyLevels[index];
            const priceChange = getPriceChange(level, prevLevel);
            const quantityChange = getQuantityChange(level, prevLevel);

            return (
              <PriceLevelRow key={`buy-${index}`}>
                <QuantityBar
                  type="bid"
                  width={getQuantityPercentage(level.totalQuantity)}
                />
                <PriceLevelContent>
                  <Quantity changed={quantityChange}>
                    {level.totalQuantity.toLocaleString()}
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

      {/* 체결 데이터는 현재 렌더링하지 않음 */}
      {/* 추후 필요 시 아래 블록을 활성화할 수 있음 */}
      {/*
      <TradesContainer>
        <h3>체결 리스트</h3>
        {tradeList.map((trade, idx) => (
          <TradeItem key={idx}>
            <span>체결가: {trade.price.toLocaleString()}</span>
            <span>체결량: {trade.quantity.toLocaleString()}</span>
            <span>체결시간: {trade.tradeDateTime}</span>
          </TradeItem>
        ))}
      </TradesContainer>
      */}
    </Container>
  );
};

/** -- Styled Components -- */

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

const OrderBookWrapper = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  overflow: hidden;
`;

const AskLevels = styled.div`
  display: flex;
  flex-direction: column;
`;

const BidLevels = styled.div`
  display: flex;
  flex-direction: column-reverse;
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
  color: ${(props) => (props.type === 'ask' ? '#ff5454' : '#2d91ff')};
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
  color: ${(props) =>
    props.type === 'up'
      ? '#ff5454'
      : props.type === 'down'
      ? '#2d91ff'
      : '#333'};
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
  color: ${(props) =>
    props.type === 'up'
      ? '#ff5454'
      : props.type === 'down'
      ? '#2d91ff'
      : '#333'};
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

/* 체결 데이터 관련 스타일은 추후 필요 시 사용 */
export default OrderBook;
