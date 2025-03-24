import React from "react";
import { CompanySearchResponse } from "../../types/CompanySearchResponse";
import { TIME_FRAMES } from "../../hooks/useRealTimeChart";

interface ChartHeaderProps {
  companyData: CompanySearchResponse;
  selectedTimeFrame: (typeof TIME_FRAMES)[number];
  onChange: (timeFrame: (typeof TIME_FRAMES)[number]) => void;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({
  companyData,
  selectedTimeFrame,
  onChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
      <div className="flex flex-col">
        <div className="text-lg font-semibold text-gray-800">
          {companyData.isuNm} ({companyData.isuSrtCd})
        </div>
        <div className="text-xs text-gray-500">KOSPI</div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto">
        {TIME_FRAMES.map((tf) => (
          <button
            key={tf.code}
            onClick={() => onChange(tf)}
            className={`
              px-3 py-1 text-xs rounded border transition
              ${
                selectedTimeFrame.code === tf.code
                  ? "font-semibold bg-gray-200 border-gray-300"
                  : "font-normal bg-transparent border-gray-200 hover:bg-gray-100"
              }
            `}
          >
            {tf.display}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChartHeader;
