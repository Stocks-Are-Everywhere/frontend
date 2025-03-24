import React from "react";
import AccountInfo from "../../components/personal/AccountInfo";
import AssetList from "../../components/personal/AssetList";
import SavedStockList from "../../components/personal/SavedStockList";

const PersonalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        개인 정보 페이지
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Account + Asset (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <AccountInfo />
          <AssetList />
        </div>

        {/* Right: Saved Stocks */}
        <div>
          <SavedStockList />
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;
