import React from 'react';

import TradeHistoryList from './components/TradeHistory';
import OrderBook from './components/OrderBook';
import StockChart from './components/StockChart';


const App: React.FC = () => {
  return (
    <div className="App">
      <TradeHistoryList />
      <OrderBook />
      <StockChart />
    </div>
  );
};

export default App;
