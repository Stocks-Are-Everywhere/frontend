import React from "react";
import { TIME_FRAMES } from "../../hooks/useRealTimeChart";

interface Props {
  selectedTimeFrame: (typeof TIME_FRAMES)[number];
}

const ChartFooter: React.FC<Props> = ({ selectedTimeFrame }) => {
  return (
    <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
      <div className="flex gap-4">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-red-400 mr-2 rounded-sm" />
          상승
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-blue-400 mr-2 rounded-sm" />
          하락
        </div>
      </div>
      <div>
        <small>
          {selectedTimeFrame.display} 간격 캔들 차트 | 최근 100개 캔들 표시
        </small>
      </div>
    </div>
  );
};

export default ChartFooter;
