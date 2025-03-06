import React from 'react';
import styled from 'styled-components';

const MarketOverview: React.FC = () => {
  return (
    <OverviewContainer>
      <Title>시장 개요</Title>
      <OverviewItem>
        <MarketName>KOSPI</MarketName>
        <MarketValue>3,000.00</MarketValue>
        <MarketChange positive>+15.00 (+0.50%)</MarketChange>
      </OverviewItem>
      <OverviewItem>
        <MarketName>KOSDAQ</MarketName>
        <MarketValue>900.00</MarketValue>
        <MarketChange>-5.00 (-0.55%)</MarketChange>
      </OverviewItem>
      <SectionTitle>국내 투자자별 거래 현황</SectionTitle>
      <InvestorOverview>
        <InvestorItem>
          <InvestorType>개인</InvestorType>
          <InvestorValue positive>+1,234억</InvestorValue>
        </InvestorItem>
        <InvestorItem>
          <InvestorType>외국인</InvestorType>
          <InvestorValue>-567억</InvestorValue>
        </InvestorItem>
        <InvestorItem>
          <InvestorType>기관</InvestorType>
          <InvestorValue>-789억</InvestorValue>
        </InvestorItem>
      </InvestorOverview>
    </OverviewContainer>
  );
};

const OverviewContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
`;

const OverviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const MarketName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const MarketValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const MarketChange = styled.span<{ positive?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.positive ? '#ef5350' : '#26a69a')};
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 20px 0 10px 0;
`;

const InvestorOverview = styled.div`
  display: flex;
  flex-direction: column;
`;

const InvestorItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
`;

const InvestorType = styled.span`
  font-size: 14px;
  color: #666;
`;

const InvestorValue = styled.span<{ positive?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.positive ? '#ef5350' : '#26a69a')};
`;

export default MarketOverview;
