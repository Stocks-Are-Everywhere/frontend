// src/components/chart/ChartInfoPanel.tsx
import React from "react";
import styled from "styled-components";
import { ChartData } from "../../types/chart";

interface Props {
  currentCandle: ChartData | null;
  previousCandle?: ChartData;
  change: { value: number; percent: number };
  priceColor: string;
}

const ChartInfoPanel: React.FC<Props> = ({ currentCandle, previousCandle, change, priceColor }) => {
  return (
    <Wrapper>
      <Grid>
        <InfoItem>
          <Label>현재가</Label>
          <Value style={{ color: priceColor }}>
            {currentCandle?.close?.toLocaleString() ?? "-"}원
          </Value>
        </InfoItem>

        <InfoItem>
          <Label>기준가 대비</Label>
          <ChangeValue positive={change.value >= 0}>
            {change.value >= 0 ? "+" : ""}
            {change.value.toFixed(2)} ({change.value >= 0 ? "+" : ""}
            {change.percent.toFixed(2)}%)
          </ChangeValue>
        </InfoItem>

        <InfoItem>
          <Label>거래량</Label>
          <Value>
            {currentCandle?.volume?.toLocaleString() ?? "-"}주
          </Value>
        </InfoItem>

        <InfoItem>
          <Label>시가</Label>
          <Value>
            {currentCandle?.open?.toLocaleString() ?? "-"}원
          </Value>
        </InfoItem>
      </Grid>
    </Wrapper>
  );
};

export default ChartInfoPanel;

const Wrapper = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.span`
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
`;

const Value = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ChangeValue = styled.span<{ positive: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.positive ? '#ef5350' : '#5294f3')};
`;
