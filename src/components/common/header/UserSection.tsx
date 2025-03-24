import ProfileMenu from "./ProfileMenu";
import BalanceDisplay from "./BalanceDisplay";

const UserSection = () => {
  return (
    <div className="flex items-center gap-6">
      <BalanceDisplay />
      <ProfileMenu />
    </div>
  );
};

export default UserSection;
