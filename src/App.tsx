import React from 'react';
import OrderBook from './components/OrderBook';
import StockChart from './components/StockChart';

const App: React.FC = () => {
  return (
    <div className="App">
      <OrderBook />
      <StockChart companyCode='005930' />
    </div>
  );
};

export default App;
