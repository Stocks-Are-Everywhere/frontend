import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/AxiosInstance';
import { Search as SearchIcon } from '@mui/icons-material';

interface CompanySearchResponse {
  isuNm: string; // 종목명
  isuSrtCd: string; // 단축코드
  isuAbbrv: string; // 종목 약어
  isuEngNm: string; // 영문 종목명
  kindStkcertTpNm: string; // 주식종류
}

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<CompanySearchResponse[]>([]);
  const [isOpen, setIsOpen] = useState(false);
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
        try {
          const response = await axiosInstance.get<CompanySearchResponse[]>(
            `/api/companies/search?query=${searchTerm}`
          );
          console.log(response.data);

          setResults(response.data);
          setIsOpen(true);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setResults([]);
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
    navigate(`/trading/${company.isuSrtCd}`);
    setIsOpen(false);
    setSearchTerm('');
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
          onFocus={() => setIsOpen(true)}
        />
      </SearchInputWrapper>
      {isOpen && results.length > 0 && (
        <ResultsDropdown>
          {results.map((result) => (
            <ResultItem
              key={result.isuSrtCd}
              onClick={() => handleResultClick(result)}
            >
              <StockInfo>
                <StockNameRow>
                  <StockName>{result.isuNm}</StockName>
                  <StockEngName>{result.isuEngNm}</StockEngName>
                </StockNameRow>
                <StockMeta>
                  <StockCode>{result.isuSrtCd}</StockCode>
                  <MarketType>{result.kindStkcertTpNm}</MarketType>
                </StockMeta>
              </StockInfo>
            </ResultItem>
          ))}
        </ResultsDropdown>
      )}
      {isOpen && searchTerm && results.length === 0 && (
        <NoResults>검색 결과가 없습니다.</NoResults>
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

export default SearchBar;
