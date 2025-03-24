import React, { useEffect, useState, useRef } from "react";
import WebSocketService from "../../../services/WebSocketService";
import { OrderBookData, PriceLevel } from "../../../types/orderbook";
import { CompanySearchResponse } from "../../../types/CompanySearchResponse";
import OrderHeader from "./OrderHeader";
import OrderLevelRow from "./OrderLevelRow";
import CurrentPricePanel from "./CurrentPricePanel";

interface OrderBookProps {
  companyData: CompanySearchResponse;
}

const OrderBook: React.FC<OrderBookProps> = ({ companyData }) => {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const prevOrderBook = useRef<OrderBookData | null>(null);
  const orderBookWS = WebSocketService.getInstance<OrderBookData>("orderbook");

  useEffect(() => {
    orderBookWS.connect();
    const companyCode = companyData.isuSrtCd;

    orderBookWS.subscribe(
      `/topic/orderbook/${companyCode}`,
      (data: OrderBookData) => {
        const enriched = enrichOrderBook(data);
        prevOrderBook.current = orderBook;
        setOrderBook(enriched);
      }
    );

    return () => orderBookWS.disconnect();
  }, [companyData.isuSrtCd]);

  const enrichOrderBook = (data: OrderBookData): OrderBookData => {
    const currentPrice = calculateCurrentPrice(data);
    const prev = prevOrderBook.current
      ? calculateCurrentPrice(prevOrderBook.current)
      : currentPrice;

    return {
      ...data,
      currentPrice: currentPrice ?? 0,
      prevPrice: prev ?? 0,
    };
  };

  const calculateCurrentPrice = (data: OrderBookData) => {
    if (!data.sellLevels.length || !data.buyLevels.length) return null;
    const bestAsk = data.sellLevels[data.sellLevels.length - 1].price;
    const bestBid = data.buyLevels[0].price;
    return Math.floor((bestAsk + bestBid) / 2);
  };

  if (!orderBook) {
    return (
      <div className="w-[360px] mx-auto p-6 bg-white rounded-3xl shadow-md text-center text-gray-400">
        Loading...
      </div>
    );
  }

  const getChangeType = (
    current: PriceLevel,
    previous: PriceLevel | undefined
  ) => {
    if (!previous) return "none";
    if (current.price > previous.price) return "up";
    if (current.price < previous.price) return "down";
    return "none";
  };

  const maxQty = Math.max(
    ...orderBook.sellLevels.map((s) => s.quantity),
    ...orderBook.buyLevels.map((b) => b.quantity)
  );

  const priceDiff = orderBook.currentPrice - orderBook.prevPrice;
  const priceDiffPercent = (priceDiff / orderBook.prevPrice) * 100;
  const direction = priceDiff > 0 ? "up" : priceDiff < 0 ? "down" : "neutral";

  return (
    <div className="w-[360px] mx-auto p-6 bg-white rounded-3xl shadow-md font-sans">
      <OrderHeader code={companyData.isuSrtCd} name={companyData.isuNm} />

      {/* Sell Levels (reversed) */}
      <div className="flex flex-col-reverse">
        {orderBook.sellLevels.map((level, i) => {
          const prev = prevOrderBook.current?.sellLevels?.[i];
          return (
            <OrderLevelRow
              key={`sell-${i}`}
              price={level.price}
              quantity={level.quantity}
              changeType={getChangeType(level, prev)}
              type="sell"
              maxQuantity={maxQty}
            />
          );
        })}
      </div>

      {/* Current Price */}
      <CurrentPricePanel
        price={orderBook.currentPrice}
        diff={priceDiff}
        percent={priceDiffPercent}
        direction={direction}
      />

      {/* Buy Levels */}
      <div className="flex flex-col">
        {orderBook.buyLevels.map((level, i) => {
          const prev = prevOrderBook.current?.buyLevels?.[i];
          return (
            <OrderLevelRow
              key={`buy-${i}`}
              price={level.price}
              quantity={level.quantity}
              changeType={getChangeType(level, prev)}
              type="buy"
              maxQuantity={maxQty}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OrderBook;
