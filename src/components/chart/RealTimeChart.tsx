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
    <div className="flex flex-col gap-2 h-full">
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
        <div className="flex flex-col flex-1 overflow-hidden">
          <ChartBody ref={chartContainerRef} />
          <ChartInfoPanel
            currentCandle={currentCandle.current}
            previousCandle={chartData[chartData.length - 2]}
            change={change}
            priceColor={getPriceColor()}
          />
        </div>
      )}

      <ChartFooter selectedTimeFrame={selectedTimeFrame} />
    </div>
  );
};

export default RealTimeChart;
