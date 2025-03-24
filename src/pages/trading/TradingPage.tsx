import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import OrderBook from "../../components/trading/orderbook/OrderBook";
import RealTimeChart from "../../components/chart/RealTimeChart";
import CustomOrderBook from "../../components/trading/customorder/CustomOrderBook";
import TradeHistoryList from "../../components/trading/TradeHistory";
import axiosInstance from "../../api/AxiosInstance";
import { CompanySearchResponse } from "../../types/CompanySearchResponse";

const TradingPage: React.FC = () => {
  const { companyCode } = useParams<{ companyCode: string }>();
  const location = useLocation();

  const initialCompany = location.state?.selectedCompany as
    | CompanySearchResponse
    | undefined;

  const [company, setCompany] = useState<CompanySearchResponse | null>(
    initialCompany || null
  );
  const [loading, setLoading] = useState<boolean>(!initialCompany);

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
    <div className="min-h-screen flex flex-col pt-[90px] pb-8">
      <div className="flex items-center gap-3 px-6 pb-4 mb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900 m-0">
          {company.isuNm}
        </h1>
        <span className="text-sm bg-gray-100 text-gray-500 px-2 py-1 rounded">
          {company.isuSrtCd}
        </span>
        <span className="text-sm text-gray-500">{company.kindStkcertTpNm}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.5fr_0.5fr] gap-6 max-w-screen-2xl w-full mx-auto px-6 flex-1">
        {/* Left: Chart */}
        <div className="flex flex-col gap-6">
          <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-center items-center h-full">
            <RealTimeChart companyData={company} />
          </section>
        </div>

        {/* Center: OrderBook */}
        <div className="flex flex-col gap-1">
          <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col justify-center items-center h-full">
            <OrderBook companyData={company} />
          </div>
        </div>

        {/* Right: Order + History */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col flex-1">
            <CustomOrderBook companyData={company} />
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm flex flex-col flex-1">
            <TradeHistoryList companyData={company} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPage;
