// components/common/footer/FooterBottom.tsx
import React from "react";
import styled from "styled-components";

const FooterBottom = () => {
  return (
    <Wrapper>
      <CompanyInfo>
        <CompanyName>모의투자 주식회사</CompanyName>
        <CompanyDetail>사업자등록번호 123-45-67890</CompanyDetail>
        <CompanyDetail>서울특별시 강남구 테헤란로</CompanyDetail>
      </CompanyInfo>
      <Copyright>
        © 2025 Mock Investment. All rights reserved.
      </Copyright>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 24px;
  border-top: 1px solid #e5e8eb;
`;

const CompanyInfo = styled.div`
  margin-bottom: 16px;
`;

const CompanyName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333d4b;
  margin-right: 16px;
`;

const CompanyDetail = styled.span`
  font-size: 14px;
  color: #6b7684;
  margin-right: 16px;
`;

const Copyright = styled.p`
  font-size: 14px;
  color: #8b95a1;
  margin: 0;
`;

export default FooterBottom;
