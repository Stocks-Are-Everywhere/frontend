import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getBalance } from '../services/orderService';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  const [balance, setBalance] = useState<number>(1000000);

  useEffect(() => {
    setBalance(getBalance());
    const intervalId = setInterval(() => {
      setBalance(getBalance());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoSection>
          <Logo>온세주</Logo>
        </LogoSection>

        <SearchBarSection>
          <SearchBar />
        </SearchBarSection>

        <NavSection>
          <NavItem>홈</NavItem>
          <NavItem active>주식</NavItem>
          <NavItem>투자내역</NavItem>
          <NavItem>자산</NavItem>
        </NavSection>

        <UserSection>
          <Balance>
            <BalanceLabel>투자자산</BalanceLabel>
            <BalanceAmount>{balance.toLocaleString()}원</BalanceAmount>
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
  height: 80px; /* 헤더 높이 설정 */
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  position: fixed;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoSection = styled.div``;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const NavSection = styled.nav`
  display: flex;
`;

const NavItem = styled.a<{ active?: boolean }>`
  font-size: 16px;
  font-weight: ${(props) => (props.active ? '700' : '500')};
  color: ${(props) => (props.active ? '#333d4b' : '#8b95a1')};
  text-decoration: none;
  padding: 8px;

  &:hover {
    color: #333d4b; /* Hover 효과 추가 */
    border-bottom: 2px solid #3182f6; /* Hover 시 밑줄 효과 */
    transition: color 0.3s ease, border-bottom 0.3s ease; /* 부드러운 효과 */
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

const SearchBarSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Header;
