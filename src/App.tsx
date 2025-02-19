import React from 'react';

import TradeHistoryList from './components/TradeHistory';
import OrderBook from './components/OrderBook';
import Header from './components/Header';
import Footer from './components/Footer';
import styled from 'styled-components';
import StockChart from './components/StockChart';

const App: React.FC = () => {
  return (
    <div className="App">
      <AppContainer>
        <Header />
        <MainContent>
          <OrderBook />
          <TradeHistoryList />
          <StockChart />
        </MainContent>
        <Footer />
      </AppContainer>
    </div>
  );
};

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
`;

const MainContent = styled.main`
  flex: 1;
  margin-top: 64px; // 헤더 높이만큼 여백
  padding: 24px;
`;

export default App;
