import React, { useState } from 'react';
import styled from 'styled-components';
import StockRanking from '../components/StockRanking';
import MarketOverview from '../components/MarketOverview';

const HomePage: React.FC = () => {
  const [rankingCategory, setRankingCategory] = useState('volume');

  return (
    <HomeContainer>
      <MainSection>
        <StockRanking
          category={rankingCategory}
          onCategoryChange={setRankingCategory}
        />
      </MainSection>
      <SideSection>
        <MarketOverview />
      </SideSection>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
`;

const MainSection = styled.div`
  flex: 3;
`;

const SideSection = styled.div`
  flex: 1;
`;

export default HomePage;
