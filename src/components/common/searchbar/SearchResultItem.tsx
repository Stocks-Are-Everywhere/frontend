import { CompanySearchResponse } from "../../../types/CompanySearchResponse";

interface SearchResultItemProps {
  result: CompanySearchResponse;
  onClick: (company: CompanySearchResponse) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(result)}
      className="p-4 cursor-pointer hover:bg-gray-50 transition"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-900">
            {result.isuNm}
          </div>
          {result.isuEngNm && (
            <div className="text-sm text-gray-400">{result.isuEngNm}</div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{result.isuSrtCd}</span>
          {result.kindStkcertTpNm && (
            <span className="bg-gray-100 px-2 py-0.5 rounded">
              {result.kindStkcertTpNm}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem;
