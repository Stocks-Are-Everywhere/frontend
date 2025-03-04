import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyle';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TradingPage from './pages/TradingPage';

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyle />
      <Header />
      <Main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trading/:companyCode" element={<TradingPage />} />
        </Routes>
      </Main>
      <Footer />
    </Router>
  );
};

const Main = styled.main`
  flex: 1;
  width: 100%;
  background-color: #f5f6f7;
  padding-top: 80px; /* 헤더 높이에 맞춰 여백 추가 */
`;

export default App;
