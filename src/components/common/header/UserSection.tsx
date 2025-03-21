import styled from "styled-components";
import ProfileMenu from "./ProfileMenu";
import BalanceDisplay from "./BalanceDisplay";

const UserSection = () => {
  return (
    <UserWrapper>
        <BalanceDisplay />
        <ProfileMenu />
    </UserWrapper>
  );
};

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export default UserSection;
