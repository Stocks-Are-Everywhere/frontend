import React from "react";
import styled from "styled-components";

interface OAuthButtonProps {
  provider: "google" | "github" | "facebook";
  onClick: () => void;
}

const providerStyles = {
  google: { bg: "#4285f4", hover: "#357ae8", icon: "/images/google-logo-icon.svg" },
  github: { bg: "#333", hover: "#222", icon: "/images/github-logo-icon.svg" },
  facebook: { bg: "#1877F2", hover: "#1464D2", icon: "/images/facebook-logo-icon.svg" },
};

const OAuthButton: React.FC<OAuthButtonProps> = ({ provider, onClick }) => {
  const { bg, hover, icon } = providerStyles[provider];

  return (
    <StyledButton bg={bg} hover={hover} onClick={onClick}>
      <OAuthIcon src={icon} alt={`${provider} logo`} />
      Sign in with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </StyledButton>
  );
};

const StyledButton = styled.button<{ bg: string; hover: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bg};
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  font-weight: bold;

  &:hover {
    background-color: ${(props) => props.hover};
  }
`;

const OAuthIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  background-color: white;
  padding: 5px;
  border-radius: 50%;
`;

export default OAuthButton;
