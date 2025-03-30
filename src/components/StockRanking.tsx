import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../api/AxiosInstance';

// API 응답에서 받는 데이터 형식
interface TotalTradeAmountDto {
  companyCode: string;
  companyName: string;
  totalAmount: number;
}

interface TradeAvgPriceDto {
  companyCode: string;
  companyName: string;
  avgPrice: number;
}

interface TradeCountDto {
  companyCode: string;
  companyName: string;
  count: number;
}

interface RankingData {
  totalTradeAmounts: TotalTradeAmountDto[];
  tradeAvgPrices: TradeAvgPriceDto[];
  tradeCounts: TradeCountDto[];
}

interface StockRankingProps {
  category: string;
  onCategoryChange: (category: string) => void;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10분
const UPDATE_INTERVAL = 10 * 60 * 1000; // 10분

const StockRanking: React.FC<StockRankingProps> = ({
  category,
  onCategoryChange,
}) => {
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 초기 카테고리가 'volume'인 경우 'totalTradeAmounts'로 변경
  useEffect(() => {
    if (
      category === 'volume' ||
      category === 'listedshares' ||
      category === 'turnoverrate'
    ) {
      onCategoryChange('totalTradeAmounts');
    }
  }, [category, onCategoryChange]);

  const fetchRankingData = useCallback(async () => {
    const cachedData = localStorage.getItem('rankingData');
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setRankingData(data);
        return;
      }
    }

    try {
      const response = await axiosInstance.get('/api/rankings');
      setRankingData(response.data);
      setError(null);
      localStorage.setItem(
        'rankingData',
        JSON.stringify({
          data: response.data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('랭킹 데이터를 불러오는 데 실패했습니다:', error);
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, []);

  useEffect(() => {
    fetchRankingData();
    const intervalId = setInterval(fetchRankingData, UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchRankingData]);

  const handleCategoryChange = (
    event: React.SyntheticEvent,
    newCategory: string
  ) => {
    onCategoryChange(newCategory);
  };

  const getCategoryData = () => {
    if (!rankingData) return [];

    switch (category) {
      case 'totalTradeAmounts':
        return rankingData.totalTradeAmounts
          .slice(0, 10)
          .map((item, index) => ({
            rank: index + 1,
            companyCode: item.companyCode,
            companyName: item.companyName,
            value: item.totalAmount,
          }));
      case 'tradeAvgPrices':
        return rankingData.tradeAvgPrices.slice(0, 10).map((item, index) => ({
          rank: index + 1,
          companyCode: item.companyCode,
          companyName: item.companyName,
          value: item.avgPrice,
        }));
      case 'tradeCounts':
        return rankingData.tradeCounts.slice(0, 10).map((item, index) => ({
          rank: index + 1,
          companyCode: item.companyCode,
          companyName: item.companyName,
          value: item.count,
        }));
      default:
        return [];
    }
  };

  return (
    <RankingContainer>
      <CategoryTabs
        value={category}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        TabIndicatorProps={{ style: { display: 'none' } }}
      >
        {['totalTradeAmounts', 'tradeAvgPrices', 'tradeCounts'].map((tab) => (
          <CategoryTab
            key={tab}
            label={getCategoryName(tab)}
            value={tab}
            disableRipple
          />
        ))}
      </CategoryTabs>

      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <TableContainer component={StyledPaper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableHeaderCell width="10%">순위</TableHeaderCell>
                <TableHeaderCell width="50%">종목</TableHeaderCell>
                <TableHeaderCell width="40%" align="right">
                  {getCategoryName(category)}
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getCategoryData().map((item) => (
                <StyledTableRow key={item.companyCode} hover>
                  <RankCell>{item.rank}</RankCell>
                  <StockNameCell>{item.companyName}</StockNameCell>
                  <ValueCell>{formatValue(category, item.value)}</ValueCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </RankingContainer>
  );
};

const getCategoryName = (category: string): string => {
  const categoryNames: { [key: string]: string } = {
    totalTradeAmounts: '거래대금',
    tradeAvgPrices: '평균 거래가',
    tradeCounts: '거래횟수',
  };
  return categoryNames[category] || category;
};

const formatValue = (category: string, value: number): string => {
  switch (category) {
    case 'totalTradeAmounts':
      // 100만원 기준으로 표시 방식 변경
      if (value >= 1000000) {
        return `${parseFloat(
          (value / 1000000).toFixed(2)
        ).toLocaleString()}백만원`;
      } else {
        return `${Math.round(value).toLocaleString()}원`;
      }
    case 'tradeAvgPrices':
      // 소수점 제거하고 정수로 표시
      return `${Math.round(value).toLocaleString()}원`;
    case 'tradeCounts':
      return value.toLocaleString();
    default:
      return value.toString();
  }
};

const RankingContainer = styled(Box)({
  width: '100%',
  backgroundColor: '#ffffff',
  borderRadius: '14px',
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  padding: '16px',
  overflow: 'hidden',
});

const CategoryTabs = styled(Tabs)({
  marginBottom: '16px',
  borderBottom: '1px solid #f2f4f6',
  minHeight: '44px',
});

const CategoryTab = styled(Tab)({
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 500,
  color: '#8b95a1',
  padding: '12px 16px',
  minHeight: '44px',
  '&.Mui-selected': {
    color: '#3182f6',
    fontWeight: 700,
  },
});

const StyledPaper = styled(Paper)({
  boxShadow: 'none',
  borderRadius: 0,
});

const TableHeaderCell = styled(TableCell)({
  color: '#8b95a1',
  fontSize: '13px',
  fontWeight: 500,
  padding: '12px 16px',
  borderBottom: '1px solid #f2f4f6',
});

const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: '#f9fafb',
  },
  '& td': {
    borderBottom: '1px solid #f2f4f6',
    padding: '14px 16px',
  },
});

const RankCell = styled(TableCell)({
  fontSize: '14px',
  color: '#8b95a1',
  fontWeight: 500,
});

const StockNameCell = styled(TableCell)({
  fontSize: '15px',
  color: '#191f28',
  fontWeight: 500,
});

const ValueCell = styled(TableCell)({
  fontSize: '15px',
  color: '#191f28',
  fontWeight: 600,
  textAlign: 'right',
});

const ErrorMessage = styled(Box)({
  padding: '16px',
  color: '#e53935',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 500,
});

export default StockRanking;
