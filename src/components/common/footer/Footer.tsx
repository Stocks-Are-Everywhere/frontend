// Footer.tsx
import React from 'react';
import styled from 'styled-components';
import FooterTop from './FooterTop';
import FooterBottom from './FooterBottom';

const Footer: React.FC = () => {
  return (
    <Container>
      <Content>
        <FooterTop />
        <FooterBottom />
      </Content>
    </Container>
  );
};

const Container = styled.footer`
  width: 100%;
  background-color: #f9fafb;
  padding: 48px 0;
  margin-top: auto;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

export default Footer;
