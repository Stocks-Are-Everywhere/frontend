import React, { useState } from 'react';
import styled from 'styled-components';

interface StockRankingProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

const StockRanking: React.FC<StockRankingProps> = ({
  category,
  onCategoryChange,
}) => {
  const dummyData = {
    volume: [
      { hts_kor_isnm: '삼성전자', stck_prpr: '70,000', prdy_ctrt: '2.5' },
      { hts_kor_isnm: 'SK하이닉스', stck_prpr: '120,000', prdy_ctrt: '1.8' },
      { hts_kor_isnm: '현대차', stck_prpr: '180,000', prdy_ctrt: '-0.5' },
      { hts_kor_isnm: 'NAVER', stck_prpr: '280,000', prdy_ctrt: '3.2' },
      { hts_kor_isnm: '카카오', stck_prpr: '90,000', prdy_ctrt: '-1.2' },
    ],
    change: [
      { hts_kor_isnm: 'LG화학', stck_prpr: '650,000', prdy_ctrt: '5.2' },
      { hts_kor_isnm: '셀트리온', stck_prpr: '180,000', prdy_ctrt: '4.8' },
      {
        hts_kor_isnm: '삼성바이오로직스',
        stck_prpr: '750,000',
        prdy_ctrt: '4.5',
      },
      { hts_kor_isnm: '현대모비스', stck_prpr: '220,000', prdy_ctrt: '-3.2' },
      { hts_kor_isnm: 'KB금융', stck_prpr: '55,000', prdy_ctrt: '-2.8' },
    ],
    marketCap: [
      { hts_kor_isnm: '삼성전자', stck_prpr: '70,000', prdy_ctrt: '0.8' },
      { hts_kor_isnm: 'SK하이닉스', stck_prpr: '120,000', prdy_ctrt: '1.2' },
      { hts_kor_isnm: 'NAVER', stck_prpr: '280,000', prdy_ctrt: '2.1' },
      { hts_kor_isnm: '카카오', stck_prpr: '90,000', prdy_ctrt: '1.5' },
      {
        hts_kor_isnm: '삼성바이오로직스',
        stck_prpr: '750,000',
        prdy_ctrt: '0.5',
      },
    ],
    marketValue: [
      { hts_kor_isnm: 'LG화학', stck_prpr: '650,000', prdy_ctrt: '1.8' },
      { hts_kor_isnm: '현대차', stck_prpr: '180,000', prdy_ctrt: '0.9' },
      { hts_kor_isnm: '셀트리온', stck_prpr: '180,000', prdy_ctrt: '2.2' },
      { hts_kor_isnm: '현대모비스', stck_prpr: '220,000', prdy_ctrt: '1.1' },
      { hts_kor_isnm: 'KB금융', stck_prpr: '55,000', prdy_ctrt: '0.7' },
    ],
    largeOrders: [
      { hts_kor_isnm: 'SK하이닉스', stck_prpr: '120,000', prdy_ctrt: '2.5' },
      { hts_kor_isnm: '삼성전자', stck_prpr: '70,000', prdy_ctrt: '1.2' },
      { hts_kor_isnm: 'POSCO', stck_prpr: '280,000', prdy_ctrt: '3.8' },
      { hts_kor_isnm: '기아', stck_prpr: '75,000', prdy_ctrt: '-1.5' },
      { hts_kor_isnm: 'LG전자', stck_prpr: '110,000', prdy_ctrt: '2.1' },
    ],
  };

  const [rankingData, setRankingData] = useState(
    dummyData[category as keyof typeof dummyData]
  );

  const handleCategoryChange = (newCategory: string) => {
    onCategoryChange(newCategory);
    setRankingData(dummyData[newCategory as keyof typeof dummyData]);
  };

  return (
    <RankingContainer>
      <RankingHeader>
        <Title>실시간 순위</Title>
        <TabContainer>
          <Tab
            $active={category === 'volume'}
            onClick={() => handleCategoryChange('volume')}
          >
            거래량
          </Tab>
          <Tab
            $active={category === 'change'}
            onClick={() => handleCategoryChange('change')}
          >
            등락률
          </Tab>
          <Tab
            $active={category === 'marketCap'}
            onClick={() => handleCategoryChange('marketCap')}
          >
            시가총액
          </Tab>
          <Tab
            $active={category === 'marketValue'}
            onClick={() => handleCategoryChange('marketValue')}
          >
            시장가치
          </Tab>
          <Tab
            $active={category === 'largeOrders'}
            onClick={() => handleCategoryChange('largeOrders')}
          >
            대량체결
          </Tab>
        </TabContainer>
      </RankingHeader>
      <RankingList>
        <RankingListHeader>
          <span>순위</span>
          <span>종목명</span>
          <span>현재가</span>
          <span>등락률</span>
        </RankingListHeader>
        {rankingData.map((item, index) => (
          <RankingItem key={index}>
            <Rank>{index + 1}</Rank>
            <StockName>{item.hts_kor_isnm}</StockName>
            <StockPrice>{item.stck_prpr}원</StockPrice>
            <PriceChange positive={parseFloat(item.prdy_ctrt) > 0}>
              {parseFloat(item.prdy_ctrt) > 0 ? '+' : ''}
              {item.prdy_ctrt}%
            </PriceChange>
          </RankingItem>
        ))}
      </RankingList>
    </RankingContainer>
  );
};

const RankingContainer = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const RankingHeader = styled.div`
  padding: 20px 20px 0;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #f0f0f0;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  color: ${(props) => (props.$active ? '#3182f6' : '#666')};
  border-bottom: 2px solid
    ${(props) => (props.$active ? '#3182f6' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #3182f6;
  }
`;

const RankingList = styled.div`
  padding: 0 20px;
`;

const RankingListHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1fr;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #888;
  font-weight: 500;
`;

const RankingItem = styled.div`
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1fr;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const Rank = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const StockName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const StockPrice = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: right;
`;

const PriceChange = styled.span<{ positive: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.positive ? '#ef5350' : '#26a69a')};
  text-align: right;
`;

export default StockRanking;
