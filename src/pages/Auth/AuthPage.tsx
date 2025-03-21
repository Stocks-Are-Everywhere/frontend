import React from "react";
import styled from "styled-components";
import OAuthButton from "../../components/auth/OAuthButton";
import AuthService from "../../services/AuthService";

const AuthPage: React.FC = () => {
  return (
    <Container>
      <LeftSection>
        <AuthBox>
          <WebsiteName>온 세상이 주식이야!</WebsiteName>
          <OAuthButton provider="google" onClick={AuthService.loginWithGoogle} />
        </AuthBox>
      </LeftSection>
      <RightSection>
        <WebsiteName>로고 로고 로고</WebsiteName>
        {/* <Logo src="/images/sae_logo.svg" alt="App Logo" /> */}
      </RightSection>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #d3d3d3;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: white;
  clip-path: polygon(0 0, 100% 0, 80% 100%, 0% 100%);
`;

const AuthBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(248, 250, 249);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const WebsiteName = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  width: 300px;
`;

export default AuthPage;
