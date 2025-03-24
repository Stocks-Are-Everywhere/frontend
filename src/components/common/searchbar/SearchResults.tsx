import { CompanySearchResponse } from "../../../types/CompanySearchResponse";
import SearchResultItem from "./SearchResultItem";

interface SearchResultsProps {
  isOpen: boolean;
  isLoading: boolean;
  results: CompanySearchResponse[];
  onSelect: (company: CompanySearchResponse) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  isOpen,
  isLoading,
  results,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-[320px] overflow-y-auto z-50">
      {isLoading ? (
        <div className="p-4 text-center text-sm text-gray-400">검색 중...</div>
      ) : results.length > 0 ? (
        results.map((result) => (
          <SearchResultItem
            key={result.isuSrtCd}
            result={result}
            onClick={onSelect}
          />
        ))
      ) : (
        <div className="p-4 text-center text-sm text-gray-400">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
};

export default SearchResults;
