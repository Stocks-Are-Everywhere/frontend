import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/AxiosInstance';

interface CompanySearchResponse {
  isuNm: string; // 종목명
  isuSrtCd: string; // 단축코드
  mktTpNm: string; // 시장구분
  secugrpNm: string; // 증권구분
  isuAbbrv: string; // 종목 약어
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
      <SearchInput
        type="text"
        placeholder="종목명을 검색하세요"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && results.length > 0 && (
        <ResultsDropdown>
          {results.map((result) => (
            <ResultItem
              key={result.isuSrtCd}
              onClick={() => handleResultClick(result)}
            >
              <StockInfo>
                <StockName>{result.isuAbbrv}</StockName>
                <StockCode>{result.isuSrtCd}</StockCode>
                <MarketType>{result.mktTpNm}</MarketType>
              </StockInfo>
            </ResultItem>
          ))}
        </ResultsDropdown>
      )}
      {isOpen && results.length === 0 && (
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

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: #aaa;
    font-size: 14px;
    font-style: italic; /* Placeholders에 약간의 스타일 추가 */
  }

  &:focus {
    border-color: #3182f6;
    box-shadow: 0px 4px 8px rgba(49, 130, 246, 0.2);
    background-color: #f9f9f9;
    transition: all 0.3s ease-in-out; /* 부드러운 전환 효과 */
  }
`;

const ResultsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;

  max-height: 300px; /* 드롭다운 최대 높이 설정 */
  overflow-y: auto; /* 스크롤 활성화 */
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center; /* 아이템 내 텍스트 수직 정렬 */
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f5f5f5;
    color: #3182f6;
    font-weight: bold;
    transition: all 0.2s ease-in-out;
  }
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StockName = styled.div`
  font-size: 16px;
  font-weight: 600; /* 종목명 강조 */
  color: #333;
`;

const StockCode = styled.div`
  font-size: 14px;
  color: #888; /* 단축코드 색상 약간 흐리게 */
`;

const MarketType = styled.div`
  font-size: 14px;
  color: #666; /* 시장구분 색상 약간 흐리게 */
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  font-size: 14px;
  color: #888; /* 검색 결과 없음 메시지 색상 */
`;

export default SearchBar;
