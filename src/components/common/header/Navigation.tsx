import styled from "styled-components";

const Navigation = () => {
  return (
    <NavSection>
      <NavItem>홈</NavItem>
      <NavItem active>주식</NavItem>
      <NavItem>투자내역</NavItem>
      <NavItem>자산</NavItem>
    </NavSection>
  );
};

const NavSection = styled.nav`
  display: flex;
`;

const NavItem = styled.a<{ active?: boolean }>`
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "700" : "500")};
  color: ${(props) => (props.active ? "#333d4b" : "#8b95a1")};
  text-decoration: none;
  padding: 8px;

  &:hover {
    color: #333d4b;
    border-bottom: 2px solid #3182f6;
    transition: color 0.3s ease, border-bottom 0.3s ease;
  }
`;

export default Navigation;
