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
          <NavItem>홈</NavItem>
          <NavItem active>주식</NavItem>
          <NavItem>투자내역</NavItem>
          <NavItem>자산</NavItem>
        </NavSection>

        <UserSection>
          <Balance>
            <BalanceLabel>투자자산</BalanceLabel>
            <BalanceAmount>1,000,000원</BalanceAmount>
          </Balance>
          <UserProfile>
            <ProfileImage src="/images/default-profile.png" />
          </UserProfile>
        </UserSection>
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

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Balance = styled.div`
  text-align: right;
`;

const BalanceLabel = styled.div`
  font-size: 12px;
  color: #8b95a1;
  margin-bottom: 4px;
`;

const BalanceAmount = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333d4b;
`;

const UserProfile = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f2f2f2;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default Header;
