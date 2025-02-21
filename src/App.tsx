import React from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import Header from './components/Header';
import Footer from './components/Footer';
import TradingPage from './pages/TradingPage';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Main>
        <TradingPage />
      </Main>
      <Footer />
    </>
  );
};

const Main = styled.main`
  flex: 1;
  width: 100%;
  background-color: #f5f6f7;
`;
export default App;
