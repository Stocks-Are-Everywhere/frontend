import React from 'react';
import styled from 'styled-components';
import OrderBook from '../components/OrderBook';
import TradeHistoryList from '../components/TradeHistory';
import StockChart from '../components/StockChart';
import CustomOrderBook from '../components/CustomOrderBook';

const TradingPage: React.FC = () => {
  return (
    <PageContainer>
      <ContentGrid>
        <LeftPanel>
          <ChartSection>
            <StockChart />
          </ChartSection>
        </LeftPanel>
        <CenterPanel>
          <OrderBookSection>
            <OrderBook />
          </OrderBookSection>
        </CenterPanel>
        <RightPanel>
          <CustomOrderPanel>
            <CustomOrderBook />
          </CustomOrderPanel>
          <TradeHistoryPanel>
            <TradeHistoryList />
          </TradeHistoryPanel>
        </RightPanel>
      </ContentGrid>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 90px;
  padding-bottom: 30px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.5fr 0.5fr;
  gap: 24px;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 24px;
  flex: 1;

  @media (max-width: 1400px) {
    grid-template-columns: 1fr;
    gap: 20px;
    height: auto;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
`;

const ChartSection = styled.section`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center; // 수평 중앙 정렬
  align-items: center; // 수직 중앙 정렬
`;

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  height: 100%;
`;

const OrderBookSection = styled.div`
  background: white;
  border-radius: 16px;
  flex: 1;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center; // 수평 중앙 정렬
  align-items: center; // 수직 중앙 정렬
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
`;

const CustomOrderPanel = styled.div`
  background: white;
  border-radius: 16px;
  flex: 1;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;
const TradeHistoryPanel = styled.div`
  background: white;
  border-radius: 16px;
  flex: 1;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

export default TradingPage;
