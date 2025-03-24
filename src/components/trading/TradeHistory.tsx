import React, { useState, useEffect } from "react";
import { TradeHistory } from "../../types/tradehistory";
import axiosInstance from "../../api/AxiosInstance";
import eventbus from "../../util/eventbus";
import { CompanySearchResponse } from "../../types/CompanySearchResponse";

interface OrderBookProps {
  companyData: CompanySearchResponse;
}

const TradeHistoryList: React.FC<OrderBookProps> = ({ companyData }) => {
  const [trades, setTrades] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dummy data
  const dummyTrades: TradeHistory[] = [
    {
      id: 1,
      sellOrderId: 1001,
      buyOrderId: 2001,
      price: 72500,
      quantity: 10,
    },
    {
      id: 2,
      sellOrderId: 1002,
      buyOrderId: 2002,
      price: 72300,
      quantity: 5,
    },
    {
      id: 3,
      sellOrderId: 1003,
      buyOrderId: 2003,
      price: 72600,
      quantity: 3,
    },
  ];

  useEffect(() => {
    const unsubscribe = eventbus.subscribe(
      "newTrade",
      (newTrade: TradeHistory) => {
        setTrades((prev) => [newTrade, ...prev]);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Simulate loading dummy data
    setTimeout(() => {
      setTrades(dummyTrades);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/api/order/tradehistory`);
        console.log("Received data:", data);
        setTrades(data);
      } catch (err) {
        console.error("Failed to fetch trade history:", err);
        setError("거래 내역을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradeHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-400">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="w-[360px] h-[420px] mx-auto my-5 p-6 bg-white rounded-3xl shadow-md flex flex-col font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">체결 내역</h2>
        <span className="text-xs text-gray-400">
          최근 업데이트: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="flex flex-col gap-4">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="bg-gray-50 rounded-xl p-5 transition hover:bg-gray-100 hover:-translate-y-[1px]"
            >
              {/* Trade Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    #{trade.sellOrderId}
                  </span>
                  <span className="text-xs text-gray-400">14:30:25</span>
                </div>
                <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full">
                  체결완료
                </span>
              </div>

              {/* Trade Content */}
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-800">
                <div>
                  <span className="text-xs text-gray-400 block mb-1">
                    체결가격
                  </span>
                  <span className="font-semibold">
                    {trade.price?.toLocaleString() ?? "0"}원
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">
                    체결수량
                  </span>
                  <span className="font-semibold">
                    {trade.quantity?.toLocaleString() ?? "0"}주
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">
                    총 체결금액
                  </span>
                  <span className="font-semibold">
                    {(
                      (trade.price ?? 0) * (trade.quantity ?? 0)
                    ).toLocaleString()}
                    원
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradeHistoryList;
