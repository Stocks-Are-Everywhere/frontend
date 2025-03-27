import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import OrderBook from "../../components/trading/orderbook/OrderBook";
import RealTimeChart from "../../components/chart/RealTimeChart";
import CustomOrderBook from "../../components/trading/customorder/CustomOrderBook";
import TradeHistoryList from "../../components/trading/TradeHistory";
import axiosInstance from "../../api/AxiosInstance";
import { CompanySearchResponse } from "../../types/CompanySearchResponse";

const MIN_HEIGHT = 640;
const MAX_HEIGHT = 800;

const TradingPage: React.FC = () => {
  const { companyCode } = useParams<{ companyCode: string }>();
  const location = useLocation();
  const chartRef = useRef<HTMLDivElement>(null);
  const [clampedHeight, setClampedHeight] = useState<number>(MIN_HEIGHT);

  const initialCompany = location.state?.selectedCompany as
    | CompanySearchResponse
    | undefined;

  const [company, setCompany] = useState<CompanySearchResponse | null>(
    initialCompany || null
  );
  const [loading, setLoading] = useState<boolean>(!initialCompany);

  // Observe chart height in real-time
  useEffect(() => {
    if (!chartRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rawHeight = entry.contentRect.height;
        const adjusted = Math.max(MIN_HEIGHT, Math.min(rawHeight, MAX_HEIGHT));
        setClampedHeight(adjusted);
      }
    });

    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch company
  useEffect(() => {
    if (initialCompany && initialCompany.isuSrtCd === companyCode) {
      setCompany(initialCompany);
      setLoading(false);
      return;
    }

    const fetchCompanyInfo = async () => {
      if (companyCode) {
        try {
          setLoading(true);
          const response = await axiosInstance.get<CompanySearchResponse>(
            `/api/companies/${companyCode}`
          );
          setCompany(response.data);
        } catch (error) {
          console.error("회사 정보 조회 실패:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCompanyInfo();
  }, [companyCode, initialCompany]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-400">
        로딩 중...
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        회사 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900 m-0">
            {company.isuNm}
          </h1>
          <span className="text-sm bg-gray-100 text-gray-500 px-2 py-1 rounded">
            {company.isuSrtCd}
          </span>
          <span className="text-sm text-gray-500">
            {company.kindStkcertTpNm}
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 pb-8 pt-6 overflow-x-auto">
        <div className="flex gap-6 w-full max-w-screen-2xl mx-auto items-stretch">
          {/* Left: Chart */}
          <div className="flex-[5] flex flex-col gap-6" ref={chartRef}>
            <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-center items-center flex-1">
              <RealTimeChart companyData={company} />
            </section>
          </div>

          {/* Center: OrderBook */}
          <div
            className="flex-[2.5] flex flex-col gap-6"
            style={{ height: clampedHeight }}
          >
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col flex-1 overflow-y-auto">
              <OrderBook companyData={company} />
            </div>
          </div>

          {/* Right: Order + History */}
          <div
            className="flex-[2.5] flex flex-col gap-6"
            style={{ height: clampedHeight }}
          >
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col">
              <CustomOrderBook companyData={company} />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col flex-1 overflow-y-auto">
              <TradeHistoryList companyData={company} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TradingPage;
