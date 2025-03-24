import React from "react";
import { useNavigate } from "react-router-dom";

const AccountInfo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">계좌 정보</h2>
      <p className="text-sm text-gray-500">
        계좌 잔액 및 상태 정보를 여기에 표시합니다.
      </p>
    </div>
  );
};

export default AccountInfo;
