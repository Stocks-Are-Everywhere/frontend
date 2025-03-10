// TradingPage.tsx (styled 부분 제외)
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import OrderBook from '../../components/OrderBook';
import TradeHistoryList from '../../components/TradeHistory';
import CustomOrderBook from '../../components/CustomOrderBook';
import RealTimeChart from '../../components/RealTimeChart';
import axiosInstance from '../../api/AxiosInstance';
import { CompanySearchResponse } from '../../types/CompanySearchResponse';
import styled from 'styled-components';

const TradingPage: React.FC = () => {
  const { companyCode } = useParams<{ companyCode: string }>();
  const location = useLocation();

  // location.state에서 선택된 회사 정보 가져오기
  const initialCompany = location.state?.selectedCompany as
    | CompanySearchResponse
    | undefined;

  const [company, setCompany] = useState<CompanySearchResponse | null>(
    initialCompany || null
  );
  const [loading, setLoading] = useState<boolean>(!initialCompany);

  useEffect(() => {
    // 이미 회사 정보가 있고 코드가 일치하면 API 호출 건너뛰기
    if (initialCompany && initialCompany.isuSrtCd === companyCode) {
      setCompany(initialCompany);
      setLoading(false);
      return;
    }

    const fetchCompanyInfo = async () => {
      if (companyCode) {
        try {
          setLoading(true);
          // 회사 코드로 회사 정보 조회
          const response = await axiosInstance.get<CompanySearchResponse>(
            `/api/companies/${companyCode}`
          );
          setCompany(response.data);
        } catch (error) {
          console.error('회사 정보 조회 실패:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCompanyInfo();
  }, [companyCode, initialCompany]);

  if (loading) {
    return <LoadingContainer>로딩 중...</LoadingContainer>;
  }

  if (!company) {
    return <ErrorContainer>회사 정보를 찾을 수 없습니다.</ErrorContainer>;
  }

  return (
    <PageContainer>
      <CompanyHeader>
        <CompanyName>{company.isuNm}</CompanyName>
        <CompanyCode>{company.isuSrtCd}</CompanyCode>
        <CompanyType>{company.kindStkcertTpNm}</CompanyType>
      </CompanyHeader>

      <ContentGrid>
        <LeftPanel>
          <ChartSection>
            {/* props 타입이 정의된 컴포넌트 사용 */}
            <RealTimeChart companyData={company} />
          </ChartSection>
        </LeftPanel>
        <CenterPanel>
          <OrderBookSection>
            {/* props 타입이 정의된 컴포넌트 사용 */}
            <OrderBook companyData={company} />
          </OrderBookSection>
        </CenterPanel>
        <RightPanel>
          <CustomOrderPanel>
            {/* props 타입이 정의된 컴포넌트 사용 */}
            <CustomOrderBook companyData={company} />
          </CustomOrderPanel>
          <TradeHistoryPanel>
            {/* props 타입이 정의된 컴포넌트 사용 */}
            <TradeHistoryList companyData={company} />
          </TradeHistoryPanel>
        </RightPanel>
      </ContentGrid>
    </PageContainer>
  );
};

const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eaedf0;
`;

const CompanyName = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #191f28;
  margin: 0;
`;

const CompanyCode = styled.span`
  font-size: 16px;
  color: #8b95a1;
  padding: 4px 8px;
  background: #f2f4f6;
  border-radius: 6px;
`;

const CompanyType = styled.span`
  font-size: 14px;
  color: #8b95a1;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #8b95a1;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #e63946;
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 90px;
  padding-bottom: 30px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.5fr 0.5fr;
  gap: 24px;
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 24px;
  flex: 1;

  @media (max-width: 1400px) {
    grid-template-columns: 1fr;
    gap: 20px;
    height: auto;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
`;

const ChartSection = styled.section`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center; // 수평 중앙 정렬
  align-items: center; // 수직 중앙 정렬
`;

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  height: 100%;
`;

const OrderBookSection = styled.div`
  background: white;
  border-radius: 16px;
  flex: 1;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center; // 수평 중앙 정렬
  align-items: center; // 수직 중앙 정렬
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
`;

const CustomOrderPanel = styled.div`
  background: white;
  border-radius: 16px;
  flex: 1;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const TradeHistoryPanel = styled.div`
  background: white;
  border-radius: 16px;
  flex: 1;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

export default TradingPage;
