// StockRanking.tsx
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
  Pagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axiosInstance from '../api/AxiosInstance';

interface RankingData {
  companyCode: string;
  companyName: string;
  rank: number;
  totalVolume?: number;
  listedShares?: number;
  turnoverRate?: number;
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
  const [rankingData, setRankingData] = useState<RankingData[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20; // 토스증권은 한 페이지에 더 많은 항목 표시

  const fetchRankingData = useCallback(async () => {
    const cachedData = localStorage.getItem(`rankingData_${category}`);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setRankingData(data);
        return;
      }
    }

    try {
      const response = await axiosInstance.get(`/api/rankings/${category}`);
      setRankingData(response.data);
      localStorage.setItem(
        `rankingData_${category}`,
        JSON.stringify({
          data: response.data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('랭킹 데이터를 불러오는 데 실패했습니다:', error);
    }
  }, [category]);

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

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const paginatedData = rankingData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <RankingContainer>
      <CategoryTabs
        value={category}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        TabIndicatorProps={{ style: { display: 'none' } }}
      >
        {['volume', 'listedshares', 'turnoverrate'].map((tab) => (
          <CategoryTab
            key={tab}
            label={getCategoryName(tab)}
            value={tab}
            disableRipple
          />
        ))}
      </CategoryTabs>

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
            {paginatedData.map((item) => (
              <StyledTableRow key={item.companyCode} hover>
                <RankCell>{item.rank}</RankCell>
                <StockNameCell>{item.companyName}</StockNameCell>
                <ValueCell>{getCategoryValue(category, item)}</ValueCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PaginationContainer>
        <StyledPagination
          count={Math.ceil(rankingData.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="small"
          shape="rounded"
        />
      </PaginationContainer>
    </RankingContainer>
  );
};

const getCategoryName = (category: string): string => {
  const categoryNames: { [key: string]: string } = {
    volume: '거래량',
    listedshares: '상장주식수',
    turnoverrate: '거래회전율',
  };
  return categoryNames[category] || category;
};

const getCategoryValue = (category: string, item: RankingData): string => {
  switch (category) {
    case 'volume':
      return item.totalVolume?.toLocaleString() || '';
    case 'listedshares':
      return item.listedShares?.toLocaleString() || '';
    case 'turnoverrate':
      return item.turnoverRate ? `${item.turnoverRate.toFixed(2)}%` : '';
    default:
      return '';
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

const PaginationContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '16px',
});

const StyledPagination = styled(Pagination)({
  '& .MuiPaginationItem-root': {
    color: '#8b95a1',
  },
  '& .Mui-selected': {
    backgroundColor: '#f2f4f6',
    color: '#191f28',
  },
});

export default StockRanking;
