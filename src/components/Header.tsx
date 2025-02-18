// Header.tsx
import React from 'react';
import styled from 'styled-components';

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoSection>
          <Logo>온세주</Logo>
        </LogoSection>

        <NavSection>
          <NavItem active>홈</NavItem>
          <NavItem>주식</NavItem>
          <NavItem>투자내역</NavItem>
          <NavItem>자산</NavItem>
        </NavSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #f2f2f2;
  position: fixed;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoSection = styled.div`
  flex: 0 0 auto;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333d4b;
  margin: 0;
`;

const NavSection = styled.nav`
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 32px;
`;

const NavItem = styled.a<{ active?: boolean }>`
  font-size: 16px;
  font-weight: ${(props) => (props.active ? '700' : '500')};
  color: ${(props) => (props.active ? '#333d4b' : '#8b95a1')};
  text-decoration: none;
  padding: 8px 0;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #333d4b;
  }
`;

export default Header;
