import React from "react";
import { ChartData } from "../../types/chart";

interface Props {
  currentCandle: ChartData | null;
  previousCandle?: ChartData;
  change: { value: number; percent: number };
  priceColor: string;
}

const ChartInfoPanel: React.FC<Props> = ({
  currentCandle,
  change,
  priceColor,
}) => {
  return (
    <div className="mt-5 p-4 bg-gray-100 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {/* 현재가 */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-600 mb-1">현재가</span>
          <span
            className="text-base font-semibold"
            style={{ color: priceColor }}
          >
            {currentCandle?.close?.toLocaleString() ?? "-"}원
          </span>
        </div>

        {/* 기준가 대비 */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-600 mb-1">기준가 대비</span>
          <span
            className={`text-base font-semibold ${
              change.value >= 0 ? "text-red-500" : "text-blue-500"
            }`}
          >
            {change.value >= 0 ? "+" : ""}
            {change.value.toFixed(2)} ({change.value >= 0 ? "+" : ""}
            {change.percent.toFixed(2)}%)
          </span>
        </div>

        {/* 거래량 */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-600 mb-1">거래량</span>
          <span className="text-base font-semibold text-gray-800">
            {currentCandle?.volume?.toLocaleString() ?? "-"}주
          </span>
        </div>

        {/* 시가 */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-600 mb-1">시가</span>
          <span className="text-base font-semibold text-gray-800">
            {currentCandle?.open?.toLocaleString() ?? "-"}원
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartInfoPanel;
