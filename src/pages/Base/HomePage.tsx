// HomePage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import StockRanking from '../../components/market/StockRanking';
import MarketOverview from '../../components/market/MarketOverview';

const HomePage: React.FC = () => {
  const [rankingCategory, setRankingCategory] = useState('volume');

  return (
    <HomeContainer>
      <MainSection>
        <Header>
          <Title>실시간 차트</Title>
          <Subtitle>오늘 10:15 기준</Subtitle>
        </Header>
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

// Styled Components
const HomeContainer = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  height: 100%;
  min-height: calc(100vh - 40px); /* 패딩 고려 */

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 16px;
    min-height: auto;
  }
`;

const MainSection = styled.div`
  flex: 2; /* 3에서 2로 변경하여 메인 섹션 너비 감소 */
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;

const SideSection = styled.div`
  flex: 1;
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  height: fit-content; /* 내용에 맞게 높이 조정 */
  align-self: flex-start; /* 상단에 정렬 */
  min-width: 280px; /* 최소 너비 설정 */
  max-width: 320px; /* 최대 너비 설정 */

  @media (max-width: 1024px) {
    margin-top: 16px;
    padding: 16px;
    width: 100%;
    max-width: 100%;
    min-width: auto;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #191f28;
  margin: 0;
`;

const Subtitle = styled.span`
  font-size: 13px;
  color: #8b95a1;
`;

export default HomePage;
