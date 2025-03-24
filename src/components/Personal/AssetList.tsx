import React from "react";
import { useNavigate } from "react-router-dom";

const AssetList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">보유 자산</h2>
      <p className="text-sm text-gray-500">보유 중인 주식 및 총 자산 정보.</p>
    </div>
  );
};

export default AssetList;
