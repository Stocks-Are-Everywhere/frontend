import React from "react";
import styled from "styled-components";
import AuthService from "../../services/AuthService"

const GoogleOAuthButton: React.FC = () => {
  return (
      <StyledButton onClick={AuthService.loginWithGoogle}>
          <GoogleIcon src="/images/google-logo-icon.svg" alt="Google logo" />
          Sign in with Google
      </StyledButton>
  );
};


const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4285f4;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  font-weight: bold;

  &:hover {
    background-color: #357ae8;
  }
`;

const GoogleIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  background-color: white;  // White background
  padding: 5px;             // Add padding to create spacing
  border-radius: 50%;       // Make it circular
`;

export default GoogleOAuthButton;
