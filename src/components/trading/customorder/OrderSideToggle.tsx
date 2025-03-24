interface Props {
  side: "buy" | "sell";
  onChange: (side: "buy" | "sell") => void;
}

const OrderSideToggle: React.FC<Props> = ({ side, onChange }) => {
  return (
    <div className="flex gap-2 mb-4">
      <button
        className={`flex-1 py-2 rounded text-sm font-semibold transition-colors ${
          side === "buy"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        onClick={() => onChange("buy")}
      >
        매수
      </button>
      <button
        className={`flex-1 py-2 rounded text-sm font-semibold transition-colors ${
          side === "sell"
            ? "bg-red-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        onClick={() => onChange("sell")}
      >
        매도
      </button>
    </div>
  );
};

export default OrderSideToggle;
