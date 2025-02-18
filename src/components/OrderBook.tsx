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
        <CompanyInfo>
          <CompanyCode>{orderBook.companyCode}</CompanyCode>
          <CompanyName>삼성전자</CompanyName>
        </CompanyInfo>
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

const UpdateTime = styled.div`
  font-size: 12px;
  color: #999;
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
  cursor: help; // 툴팁이 있음을 나타내는 커서

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
  top: -40px; // -30px에서 -40px로 변경하여 더 멀리 표시
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px; // 패딩 증가
  border-radius: 6px; // 모서리 둥글기 증가
  font-size: 13px; // 폰트 크기 증가
  font-weight: 500; // 폰트 두께 증가
  white-space: nowrap;
  opacity: 0;
  transition: all 0.3s ease; // 부드러운 전환 효과
  pointer-events: none;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6px; // 화살표 크기에 맞춰 조정
    transform: translateX(-50%);
    border-left: 6px solid transparent; // 화살표 크기 증가
    border-right: 6px solid transparent; // 화살표 크기 증가
    border-top: 6px solid rgba(0, 0, 0, 0.8); // 화살표 크기 증가
  }

  ${Quantity}:hover & {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px); // 호버 시 약간 위로 이동
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

// 기존 Divider 스타일 수정
const Divider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid #eee;
`;

// 수량 막대 비율 계산 함수
const getQuantityPercentage = (quantity: number) => {
  const MAX_QUANTITY = 100000; // 적절한 최대값 설정
  return Math.min((quantity / MAX_QUANTITY) * 100, 100);
};

export default OrderBook;
