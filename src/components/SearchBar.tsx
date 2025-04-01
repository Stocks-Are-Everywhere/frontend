import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from '@mui/icons-material';
import { CompanySearchResponse } from '../types/CompanySearchResponse';
import orderAxiosInstance from '../api/OrderAxiosInstance';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<CompanySearchResponse[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.length >= 1) {
        setIsLoading(true);
        setError(null);

        try {
          const response = await orderAxiosInstance.get<any>(
            `/api/companies/search?query=${searchTerm}`
          );

          // 응답 데이터 검증
          if (response && response.data) {
            // 응답이 배열인지 확인
            if (Array.isArray(response.data)) {
              setResults(response.data);
            } else if (
              response.data.content &&
              Array.isArray(response.data.content)
            ) {
              // 응답이 { content: [...] } 형태인 경우
              setResults(response.data.content);
            } else {
              // 응답이 배열이 아닌 경우 빈 배열로 설정
              console.error('API 응답이 배열 형식이 아닙니다:', response.data);
              setResults([]);
              setError('검색 결과를 불러올 수 없습니다.');
            }
          } else {
            setResults([]);
          }

          console.log('검색 결과:', response.data);
          setIsOpen(true);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setResults([]);
          setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 200); // 디바운싱 적용
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleResultClick = (company: CompanySearchResponse) => {
    // 회사 정보를 state로 전달하면서 페이지 이동
    console.log('선택된 회사 정보:', company);

    // 주문 페이지로 이동하면서 회사 정보 전달
    navigate(`/order/${company.isuSrtCd}`, {
      state: { selectedCompany: company },
    });

    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleResultClick(results[0]); // 첫 번째 검색 결과 선택
    }
  };

  // 안전하게 map 함수 사용
  const renderResults = () => {
    if (!Array.isArray(results)) {
      return <NoResults>검색 결과를 불러올 수 없습니다.</NoResults>;
    }

    if (results.length === 0) {
      return <NoResults>검색 결과가 없습니다.</NoResults>;
    }

    return results.map((result) => (
      <ResultItem
        key={result.isuSrtCd}
        onClick={() => handleResultClick(result)}
      >
        <StockInfo>
          <StockNameRow>
            <StockName>{result.isuNm}</StockName>
            {result.isuEngNm && <StockEngName>{result.isuEngNm}</StockEngName>}
          </StockNameRow>
          <StockMeta>
            <StockCode>{result.isuSrtCd}</StockCode>
            {result.kindStkcertTpNm && (
              <MarketType>{result.kindStkcertTpNm}</MarketType>
            )}
          </StockMeta>
        </StockInfo>
      </ResultItem>
    ));
  };

  return (
    <SearchContainer ref={searchRef}>
      <SearchInputWrapper>
        <SearchIconWrapper>
          <SearchIcon style={{ color: '#8b95a1', fontSize: 20 }} />
        </SearchIconWrapper>
        <SearchInput
          type="text"
          placeholder="종목명을 검색하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <ClearButton onClick={() => setSearchTerm('')}>✕</ClearButton>
        )}
      </SearchInputWrapper>

      {isOpen && (
        <ResultsDropdown>
          {isLoading ? (
            <LoadingMessage>검색 중...</LoadingMessage>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : (
            renderResults()
          )}
        </ResultsDropdown>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #f2f4f6;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:focus-within {
    background-color: #ffffff;
    box-shadow: 0px 0px 0px 2px #3182f6;
  }
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 12px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 8px;
  font-size: 15px;
  border: none;
  background: transparent;
  outline: none;
  color: #191f28;

  &::placeholder {
    color: #8b95a1;
    font-size: 15px;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #8b95a1;
  font-size: 14px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &:hover {
    color: #191f28;
  }
`;

const ResultsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 14px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  max-height: 320px;
  overflow-y: auto;
  z-index: 100;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 14px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f9fafb;
  }
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const StockNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StockName = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #191f28;
`;

const StockEngName = styled.div`
  font-size: 14px;
  color: #8b95a1;
`;

const StockMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StockCode = styled.div`
  font-size: 13px;
  color: #8b95a1;
`;

const MarketType = styled.div`
  font-size: 12px;
  color: #8b95a1;
  background-color: #f2f4f6;
  padding: 2px 6px;
  border-radius: 4px;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  font-size: 14px;
  color: #8b95a1;
`;

const LoadingMessage = styled.div`
  padding: 16px;
  text-align: center;
  font-size: 14px;
  color: #8b95a1;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  color: #e53935;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
`;

export default SearchBar;
