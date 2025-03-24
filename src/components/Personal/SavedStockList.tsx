import { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";

const SavedStockList: React.FC = () => {
  const [savedTickers, setSavedTickers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSaved = async () => {
      const tickers = await ApiService.getSavedStocks();
      setSavedTickers(tickers);
      setLoading(false);
    };
    fetchSaved();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">관심 종목</h2>

      {loading ? (
        <div className="text-sm text-gray-500">불러오는 중...</div>
      ) : savedTickers.length === 0 ? (
        <div className="text-sm text-gray-500">저장된 종목이 없습니다.</div>
      ) : (
        <ul className="space-y-2">
          {savedTickers.map((ticker) => (
            <li
              key={ticker}
              className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg shadow-sm text-sm text-gray-700"
            >
              <span>{ticker}</span>
              <button
                disabled
                className="text-xs px-2 py-1 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed"
              >
                상세보기
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedStockList;
