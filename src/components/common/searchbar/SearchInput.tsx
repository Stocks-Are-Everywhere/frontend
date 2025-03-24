import { Search as SearchIcon } from "@mui/icons-material";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onClear: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onFocus,
  onClear,
  onKeyDown,
}) => {
  return (
    <div
      className={`
        flex items-center w-full bg-gray-100 rounded-xl transition-all
        focus-within:bg-white focus-within:shadow-[0_0_0_2px_#3182f6]
      `}
    >
      <div className="pl-3 text-gray-400">
        <SearchIcon style={{ fontSize: 20 }} />
      </div>
      <input
        type="text"
        className="w-full py-3 px-4 text-sm bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
        placeholder="종목명을 검색하세요"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
      />
      {value && (
        <button
          className="text-gray-400 text-sm px-3 hover:text-gray-800"
          onClick={onClear}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchInput;
