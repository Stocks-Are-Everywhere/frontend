interface Props {
  priceType: "limit" | "market";
  onChange: (type: "limit" | "market") => void;
}

const PriceTypeSelector: React.FC<Props> = ({ priceType, onChange }) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        className={`flex-1 py-2 rounded text-sm font-semibold transition-colors ${
          priceType === "limit"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        onClick={() => onChange("limit")}
      >
        지정가
      </button>
      <button
        className={`flex-1 py-2 rounded text-sm font-semibold transition-colors ${
          priceType === "market"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        onClick={() => onChange("market")}
      >
        시장가
      </button>
    </div>
  );
};

export default PriceTypeSelector;
