import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getBalance } from '../../../services/orderService';
import Logo from './Logo';
import SearchBar from './SearchBar';
import Navigation from './Navigation';
import UserSection from './UserSection';

const Header: React.FC = () => {
  const navigate = useNavigate();
  
  const handleHome = () => {
    navigate("/");
  }
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

        <Logo />
        
        <SearchBarSection>
          <SearchBar />
        </SearchBarSection>
        
        <Navigation />
        
        <UserSection />
      
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

const SearchBarSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Header;
