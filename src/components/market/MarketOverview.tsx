import React from 'react';
import styled from 'styled-components';

const MarketOverview: React.FC = () => {
  const marketData = [
    {
      name: '코스피',
      value: '2,559.93',
      change: '-16.23 (0.6%)',
      positive: false,
    },
    { name: '코스닥', value: '736.23', change: '+1.31 (0.1%)', positive: true },
    {
      name: '나스닥',
      value: '18,069.26',
      change: '-483.47 (2.6%)',
      positive: false,
    },
    {
      name: 'S&P 500',
      value: '5,738.52',
      change: '-104.11 (1.7%)',
      positive: false,
    },
    { name: 'VIX', value: '24.87', change: '+2.94 (13.4%)', positive: true },
  ];

  const investorData = [
    { type: '개인', value: '+1,234억', positive: true },
    { type: '외국인', value: '-567억', positive: false },
    { type: '기관', value: '-789억', positive: false },
  ];

  const newsData = [
    '코스피, 오락가락 트럼프 발언 관세 피로감에 약세 출발...',
    '달러 강세 지속... 환율 상승 전망',
  ];

  return (
    <Container>
      {/* 지수 · 환율 */}
      <Section>
        <SectionTitle>지수 · 환율</SectionTitle>
        <List>
          {marketData.map((market, index) => (
            <ListItem key={index}>
              <NameWrapper>
                <Name>{market.name}</Name>
                <Value>{market.value}</Value>
              </NameWrapper>
              <Change positive={market.positive}>{market.change}</Change>
            </ListItem>
          ))}
        </List>
      </Section>

      {/* 투자자별 거래 현황 */}
      <Section>
        <SectionTitle>투자자별 거래 현황</SectionTitle>
        <List>
          {investorData.map((investor, index) => (
            <ListItem key={index}>
              <Name>{investor.type}</Name>
              <Change positive={investor.positive}>{investor.value}</Change>
            </ListItem>
          ))}
        </List>
      </Section>

      {/* 주요 뉴스 */}
      <Section>
        <SectionTitle>주요 뉴스</SectionTitle>
        <NewsList>
          {newsData.map((news, index) => (
            <NewsItem key={index}>
              <NewsContent>{news}</NewsContent>
              <NewsTime>1시간 전</NewsTime>
            </NewsItem>
          ))}
        </NewsList>
      </Section>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #191f28;
`;

const Section = styled.div`
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #191f28;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f2f4f6;
`;

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f2f4f6;
  }
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #191f28;
`;

const Value = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #191f28;
`;

const Change = styled.span<{ positive?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.positive ? '#f45858' : '#4990e2')};
  text-align: right;
`;

const NewsList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin: 0;
`;

const NewsItem = styled.li`
  padding: 12px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f2f4f6;
  }
`;

const NewsContent = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #191f28;
  margin: 0 0 4px 0;
  line-height: 1.4;
`;

const NewsTime = styled.span`
  font-size: 12px;
  color: #8b95a1;
`;

export default MarketOverview;
