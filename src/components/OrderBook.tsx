import React, { useState } from 'react';
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

  // 현재가 계산 함수
  const calculateCurrentPrice = (data: OrderBookData) => {
    if (data.sellLevels.length === 0 || data.buyLevels.length === 0) return null;

    // 최우선 매도/매수 호가의 중간값을 현재가로 설정
    const bestAskPrice = data.sellLevels[data.sellLevels.length - 1].price; // 가장 낮은 매도가
    const bestBidPrice = data.buyLevels[0].price; // 가장 높은 매수가
    return Math.floor((bestAskPrice + bestBidPrice) / 2);
  };

  // 툴팁 내용을 더 보기 좋게 포맷팅
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
        // 애니메이션 클래스 추가
        priceElement.classList.add('price-changed');

        // 애니메이션 종료 후 클래스 제거
        setTimeout(() => {
          priceElement.classList.remove('price-changed');
        }, 500);
      }
    }
    prevPrice.current = orderBook?.currentPrice ?? null;
  }, [orderBook?.currentPrice]);

  useEffect(() => {
    webSocketService.connect();
    webSocketService.subscribe('/topic/orderbook/005930', (data) => {
      // 현재가와 이전가 계산하여 데이터에 추가
      const currentPrice = calculateCurrentPrice(data);
      const prevPrice = prevOrderBook.current
        ? calculateCurrentPrice(prevOrderBook.current)
        : currentPrice;

      const enrichedData = {
        ...data,
        currentPrice: currentPrice ?? 0,
        prevPrice: prevPrice ?? 0,
      };

      prevOrderBook.current = orderBook;
      setOrderBook(enrichedData);
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
        <Title>체결 내역</Title>
        <UpdateTime>
          최근 업데이트: {new Date().toLocaleTimeString()}
        </UpdateTime>
      </Header>
      <OrderBookWrapper>
        <AskLevels>
          {orderBook.sellLevels.map((level, index) => {
            const prevLevel = prevOrderBook.current?.sellLevels[index];
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
                    : (orderBook?.currentPrice ?? 0) <
                      (orderBook?.prevPrice ?? 0)
                    ? 'down'
                    : 'same'
                }
              >
                {(
                  (orderBook?.currentPrice ?? 0) - (orderBook?.prevPrice ?? 0)
                ).toLocaleString()}
              </ChangeAmount>
              <ChangePercent
                type={
                  (orderBook?.currentPrice ?? 0) > (orderBook?.prevPrice ?? 0)
                    ? 'up'
                    : (orderBook?.currentPrice ?? 0) <
                      (orderBook?.prevPrice ?? 0)
                    ? 'down'
                    : 'same'
                }
              >
                {(
                  (((orderBook?.currentPrice ?? 0) -
                    (orderBook?.prevPrice ?? 0)) /
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
          {orderBook.buyLevels.map((level, index) => {
            const prevLevel = prevOrderBook.current?.buyLevels[index];
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
