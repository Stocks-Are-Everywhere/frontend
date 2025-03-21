// src/components/chart/ChartFooter.tsx
import React from "react";
import styled from "styled-components";
import { TIME_FRAMES } from "../../hooks/useRealTimeChart";

interface Props {
  selectedTimeFrame: typeof TIME_FRAMES[number];
}

const ChartFooter: React.FC<Props> = ({ selectedTimeFrame }) => {
  return (
    <FooterContainer>
      <Legend>
        <LegendItem color="#ef5350">상승</LegendItem>
        <LegendItem color="#5294f3">하락</LegendItem>
      </Legend>
      <InfoText>
        <small>
          {selectedTimeFrame.display} 간격 캔들 차트 | 최근 100개 캔들 표시
        </small>
      </InfoText>
    </FooterContainer>
  );
};

export default ChartFooter;

const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  font-size: 12px;
  color: #777;
`;

const Legend = styled.div`
  display: flex;
  gap: 10px;
`;

const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    background: ${(props) => props.color};
    margin-right: 5px;
  }
`;

const InfoText = styled.div``;
