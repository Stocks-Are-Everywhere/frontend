// src/components/chart/RealTimeChart.tsx
import React from "react";
import styled from "styled-components";
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
    <ChartContainer>
      <ChartHeader
        companyData={companyData}
        selectedTimeFrame={selectedTimeFrame}
        onChange={setSelectedTimeFrame}
      />

      {error ? (
        <Message color="#d32f2f">{error}</Message>
      ) : isLoading ? (
        <Message>차트 데이터를 불러오는 중입니다...</Message>
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
    </ChartContainer>
  );
};

export default RealTimeChart;

const ChartContainer = styled.div`
  width: 800px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
`;

const Message = styled.div<{ color?: string }>`
  padding: 40px;
  text-align: center;
  font-size: 16px;
  color: ${(props) => props.color || '#666'};
`;
