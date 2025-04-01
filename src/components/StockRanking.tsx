import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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
  // 초기 상태를 빈 배열로 설정
  const [rankingData, setRankingData] = useState<RankingData>({
    totalTradeAmounts: [],
    tradeAvgPrices: [],
    tradeCounts: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
    setLoading(true);
    const cachedData = localStorage.getItem('rankingData');
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setRankingData(data);
        setLoading(false);
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankingData();
    const intervalId = setInterval(fetchRankingData, UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchRankingData]);

  const handleCategoryChange = (newCategory: string) => {
    onCategoryChange(newCategory);
  };

  const handleRowClick = (companyCode: string) => {
    navigate(`/order/${companyCode}`);
  };

  const getCategoryData = () => {
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
      <CategoryTabsContainer>
        {['totalTradeAmounts', 'tradeAvgPrices', 'tradeCounts'].map((tab) => (
          <CategoryTab
            key={tab}
            active={category === tab}
            onClick={() => handleCategoryChange(tab)}
          >
            {getCategoryName(tab)}
          </CategoryTab>
        ))}
      </CategoryTabsContainer>

      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>데이터를 불러오는 중입니다...</LoadingText>
        </LoadingContainer>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <TableContainer>
          <Table>
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
              {getCategoryData().length > 0 ? (
                getCategoryData().map((item) => (
                  <StyledTableRow
                    key={item.companyCode}
                    onClick={() => handleRowClick(item.companyCode)}
                  >
                    <RankCell>{item.rank}</RankCell>
                    <StockNameCell>{item.companyName}</StockNameCell>
                    <ValueCell>{formatValue(category, item.value)}</ValueCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <td
                    colSpan={3}
                    style={{ textAlign: 'center', padding: '20px 0' }}
                  >
                    전일 거래 내역이 없습니다.
                  </td>
                </StyledTableRow>
              )}
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
      if (value >= 1000000) {
        return `${parseFloat(
          (value / 1000000).toFixed(2)
        ).toLocaleString()}백만원`;
      } else {
        return `${Math.round(value).toLocaleString()}원`;
      }
    case 'tradeAvgPrices':
      return `${Math.round(value).toLocaleString()}원`;
    case 'tradeCounts':
      return value.toLocaleString();
    default:
      return value.toString();
  }
};

// Styled Components
const RankingContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  padding: 16px;
  overflow: hidden;
`;

const CategoryTabsContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #f2f4f6;
`;

const CategoryTab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: ${(props) => (props.active ? 700 : 500)};
  color: ${(props) => (props.active ? '#3182f6' : '#8b95a1')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #3182f6;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead``;

const TableBody = styled.tbody``;

const TableRow = styled.tr``;

const TableHeaderCell = styled.th<{ width?: string; align?: string }>`
  color: #8b95a1;
  font-size: 13px;
  font-weight: 500;
  padding: 12px 16px;
  border-bottom: 1px solid #f2f4f6;
  text-align: ${(props) => props.align || 'left'};
  width: ${(props) => props.width || 'auto'};
`;

const StyledTableRow = styled.tr`
  cursor: pointer;
  &:hover {
    background-color: #f9fafb;
  }

  & td {
    border-bottom: 1px solid #f2f4f6;
    padding: 14px 16px;
  }
`;

const RankCell = styled.td`
  font-size: 14px;
  color: #8b95a1;
  font-weight: 500;
`;

const StockNameCell = styled.td`
  font-size: 15px;
  color: #191f28;
  font-weight: 500;
`;

const ValueCell = styled.td`
  font-size: 15px;
  color: #191f28;
  font-weight: 600;
  text-align: right;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  color: #e53935;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3182f6;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #8b95a1;
  font-size: 14px;
`;

export default StockRanking;
