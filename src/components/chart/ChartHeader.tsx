// src/components/chart/ChartHeader.tsx
import React from "react";
import styled from "styled-components";
import { CompanySearchResponse } from "../../types/CompanySearchResponse";
import { TIME_FRAMES } from "../../hooks/useRealTimeChart";

interface ChartHeaderProps {
  companyData: CompanySearchResponse;
  selectedTimeFrame: typeof TIME_FRAMES[number];
  onChange: (timeFrame: typeof TIME_FRAMES[number]) => void;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ companyData, selectedTimeFrame, onChange }) => {
  return (
    <HeaderContainer>
      <SymbolInfo>
        <SymbolName>
          {companyData.isuNm} ({companyData.isuSrtCd})
        </SymbolName>
        <Exchange>KOSPI</Exchange>
      </SymbolInfo>

      <TimeFrameSelector>
        {TIME_FRAMES.map((tf) => (
          <TimeFrameButton
            key={tf.code}
            active={selectedTimeFrame.code === tf.code}
            onClick={() => onChange(tf)}
          >
            {tf.display}
          </TimeFrameButton>
        ))}
      </TimeFrameSelector>
    </HeaderContainer>
  );
};

export default ChartHeader;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const SymbolInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SymbolName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const Exchange = styled.div`
  font-size: 12px;
  color: #666;
`;

const TimeFrameSelector = styled.div`
  display: flex;
  gap: 5px;

  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 5px;
  }
`;

const TimeFrameButton = styled.button<{ active: boolean }>`
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: ${(props) => (props.active ? '600' : '400')};
  background-color: ${(props) => (props.active ? '#e0e0e0' : 'transparent')};
  border: 1px solid ${(props) => (props.active ? '#ccc' : '#e0e0e0')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? '#e0e0e0' : '#f5f5f5')};
  }
`;