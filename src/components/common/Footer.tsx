// Footer.tsx
import React from 'react';
import styled from 'styled-components';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterSection>
            <FooterTitle>고객센터</FooterTitle>
            <FooterText>평일 09:00 ~ 18:00</FooterText>
            <FooterText>점심시간 12:00 ~ 13:00</FooterText>
          </FooterSection>

          <FooterSection>
            <FooterTitle>모의투자 서비스</FooterTitle>
            <FooterLinks>
              <FooterLink>서비스 소개</FooterLink>
              <FooterLink>공지사항</FooterLink>
              <FooterLink>자주 묻는 질문</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>법적 고지</FooterTitle>
            <FooterLinks>
              <FooterLink>이용약관</FooterLink>
              <FooterLink>개인정보처리방침</FooterLink>
              <FooterLink>위험고지</FooterLink>
            </FooterLinks>
          </FooterSection>
        </FooterTop>

        <FooterBottom>
          <CompanyInfo>
            <CompanyName>모의투자 주식회사</CompanyName>
            <CompanyDetail>사업자등록번호 123-45-67890</CompanyDetail>
            <CompanyDetail>서울특별시 강남구 테헤란로</CompanyDetail>
          </CompanyInfo>
          <Copyright>© 2025 Mock Investment. All rights reserved.</Copyright>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #f9fafb;
  padding: 48px 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 48px;
`;

const FooterSection = styled.div`
  flex: 1;
`;

const FooterTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #333d4b;
  margin: 0 0 16px 0;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #6b7684;
  margin: 8px 0;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FooterLink = styled.a`
  font-size: 14px;
  color: #6b7684;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #333d4b;
  }
`;

const FooterBottom = styled.div`
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

export default Footer;
