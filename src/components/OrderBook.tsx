import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import WebSocketService from '../services/WebSocketService';
import { OrderBookData, PriceLevel } from '../types/orderbook';
import { TradeHistory } from '../types/tradehistory';

const FIXED_ROW_COUNT = 10; // 항상 보여줄 호가 라인 수

/**
 * 호가 배열을 FIXED_ROW_COUNT(10)개로 맞춰주는 함수
 * - 10개보다 많으면 필요한 만큼 잘라냄
 * - 10개보다 적으면 placeholder(0)로 채움
 */
function adjustLevels(levels: PriceLevel[], count: number): PriceLevel[] {
  if (levels.length > count) {
    // 뒤에서부터 count개만
    return levels.slice(-count);
  } else if (levels.length < count) {
    // 부족하면 placeholder 생성
    const placeholders = Array.from({ length: count - levels.length }, () => ({
      price: 0,
      totalQuantity: 0,
      orderCount: 0,
    }));
    // placeholders를 앞쪽에 붙여 실제 데이터가 뒤쪽(아래쪽)에 위치하게 함
    return [...placeholders, ...levels];
  }
  return levels;
}

const OrderBook: React.FC = () => {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [tradeList, setTradeList] = useState<TradeHistory[]>([]);

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

  // 수량 변동 추적
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

  // WebSocket 연결 및 데이터 수신
  useEffect(() => {
    webSocketService.connect();

    webSocketService.subscribe('/topic/orderbook/005930', (data: any) => {
      console.log('[WebSocket] Received data:', data);

      // 연결 성공 메시지
      if (data.message === 'WebSocket connection successful') {
        console.log('[WebSocket] Connection successful');
        return;
      }

      // 1) 호가 데이터인 경우 (sellLevels나 buyLevels가 있으면)
      if (data.sellLevels || data.buyLevels) {
        const currentPrice = calculateCurrentPrice(data);
        const prevPriceValue = prevOrderBook.current
          ? calculateCurrentPrice(prevOrderBook.current)
          : currentPrice;

        // 10개씩 고정하기 위해 호가 배열을 adjustLevels로 가공
        const fixedSellLevels = adjustLevels(data.sellLevels ?? [], FIXED_ROW_COUNT);
        const fixedBuyLevels = adjustLevels(data.buyLevels ?? [], FIXED_ROW_COUNT);

        const enrichedData: OrderBookData = {
          ...data,
          sellLevels: fixedSellLevels,
          buyLevels: fixedBuyLevels,
          currentPrice: currentPrice ?? 0,
          prevPrice: prevPriceValue ?? 0,
        };

        // 함수형 업데이트를 통해 이전 상태를 정확히 저장
        setOrderBook((prev) => {
          prevOrderBook.current = prev;
          return enrichedData;
        });
      }
      // 2) 체결 데이터인 경우
      else if (
        typeof data.price === 'number' &&
        typeof data.quantity === 'number' &&
        data.tradeDateTime
      ) {
        console.log('[WebSocket] Trade data received:', data);
        setTradeList((prev) => [...prev, data]);
      }
    });

    return () => {
      webSocketService.disconnect();
      console.log('[WebSocket] Disconnected');
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
        </CompanyInfo>
      </Header>

      <OrderBookWrapper>
        {/* 매도 호가 (sellLevels) */}
        <AskLevels>
          {orderBook.sellLevels.map((level, index) => {
            const prevLevel = prevOrderBook.current?.sellLevels[index];
            const priceChange = getPriceChange(level, prevLevel);
            const quantityChange = getQuantityChange(level, prevLevel);

            // placeholder 여부 (price, totalQuantity, orderCount 모두 0)
            const isPlaceholder =
              level.price === 0 &&
              level.totalQuantity === 0 &&
              level.orderCount === 0;

            return (
              <PriceLevelRow key={`sell-${index}`}>
                <QuantityBar
                  type="ask"
                  width={isPlaceholder ? 0 : getQuantityPercentage(level.totalQuantity)}
                />
                <PriceLevelContent>
                  <Quantity changed={quantityChange}>
                    {isPlaceholder ? '' : level.totalQuantity.toLocaleString()}
                    {!isPlaceholder && (
                      <QuantityTooltip>{`${level.orderCount}건`}</QuantityTooltip>
                    )}
                  </Quantity>
                  <Price type="ask" changed={priceChange}>
                    {isPlaceholder ? '' : level.price.toLocaleString()}
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

            const isPlaceholder =
              level.price === 0 &&
              level.totalQuantity === 0 &&
              level.orderCount === 0;

            return (
              <PriceLevelRow key={`buy-${index}`}>
                <QuantityBar
                  type="bid"
                  width={isPlaceholder ? 0 : getQuantityPercentage(level.totalQuantity)}
                />
                <PriceLevelContent>
                  <Quantity changed={quantityChange}>
                    {isPlaceholder ? '' : level.totalQuantity.toLocaleString()}
                    {!isPlaceholder && (
                      <QuantityTooltip>
                        {formatTooltipContent(level.orderCount)}
                      </QuantityTooltip>
                    )}
                  </Quantity>
                  <Price type="bid" changed={priceChange}>
                    {isPlaceholder ? '' : level.price.toLocaleString()}
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

export default OrderBook;
