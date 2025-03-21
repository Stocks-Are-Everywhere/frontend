import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return <StyledLogo onClick={() => navigate("/")}>온세주</StyledLogo>;
};

const StyledLogo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
`;

export default Logo;
