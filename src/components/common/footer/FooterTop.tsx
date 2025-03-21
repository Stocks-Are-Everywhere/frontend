// components/common/footer/FooterTop.tsx
import React from "react";
import styled from "styled-components";
import FooterSection from "./FooterSection";

const FooterTop = () => {
  return (
    <Container>
      <FooterSection title="고객센터">
        <Text>평일 09:00 ~ 18:00</Text>
        <Text>점심시간 12:00 ~ 13:00</Text>
      </FooterSection>

      <FooterSection title="모의투자 서비스">
        <LinkList>
          <Link>서비스 소개</Link>
          <Link>공지사항</Link>
          <Link>자주 묻는 질문</Link>
        </LinkList>
      </FooterSection>

      <FooterSection title="법적 고지">
        <LinkList>
          <Link>이용약관</Link>
          <Link>개인정보처리방침</Link>
          <Link>위험고지</Link>
        </LinkList>
      </FooterSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 48px;
`;

const Text = styled.p`
  font-size: 14px;
  color: #6b7684;
  margin: 8px 0;
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Link = styled.a`
  font-size: 14px;
  color: #6b7684;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #333d4b;
  }
`;

export default FooterTop;
