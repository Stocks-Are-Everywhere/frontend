import { useEffect, useState } from "react";
import styled from "styled-components";
import { getBalance } from "../../../services/orderService";

const BalanceDisplay = () => {
  const [balance, setBalance] = useState<number>(1000000);

  useEffect(() => {
    setBalance(getBalance());
    const intervalId = setInterval(() => {
      setBalance(getBalance());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Balance>
      <BalanceLabel>투자자산</BalanceLabel>
      <BalanceAmount>{balance.toLocaleString()}원</BalanceAmount>
    </Balance>
  );
};

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

export default BalanceDisplay;
