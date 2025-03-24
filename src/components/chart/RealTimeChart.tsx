import React from "react";
import { CompanySearchResponse } from "../../types/CompanySearchResponse";
import { useRealTimeChart } from "../../hooks/useRealTimeChart";
import ChartHeader from "./ChartHeader";
import ChartBody from "./ChartBody";
import ChartInfoPanel from "./ChartInfoPanel";
import ChartFooter from "./ChartFooter";

interface Props {
  companyData: CompanySearchResponse;
}

const RealTimeChart: React.FC<Props> = ({ companyData }) => {
  const {
    chartContainerRef,
    chartData,
    currentCandle,
    isLoading,
    error,
    selectedTimeFrame,
    setSelectedTimeFrame,
    change,
    getPriceColor,
  } = useRealTimeChart(companyData);

  return (
    <div className="w-[800px] mx-auto bg-white rounded-xl p-5 shadow-md">
      <ChartHeader
        companyData={companyData}
        selectedTimeFrame={selectedTimeFrame}
        onChange={setSelectedTimeFrame}
      />

      {error ? (
        <div className="p-10 text-center text-base text-red-600">{error}</div>
      ) : isLoading ? (
        <div className="p-10 text-center text-base text-gray-600">
          차트 데이터를 불러오는 중입니다...
        </div>
      ) : (
        <>
          <ChartBody ref={chartContainerRef} />
          <ChartInfoPanel
            currentCandle={currentCandle.current}
            previousCandle={chartData[chartData.length - 2]}
            change={change}
            priceColor={getPriceColor()}
          />
        </>
      )}

      <ChartFooter selectedTimeFrame={selectedTimeFrame} />
    </div>
  );
};

export default RealTimeChart;
