interface Props {
  onSubmit: () => void;
  disabled: boolean;
  side: "buy" | "sell";
}

const SubmitButton: React.FC<Props> = ({ onSubmit, disabled, side }) => {
  const bgColor = side === "buy" ? "bg-blue-500" : "bg-red-500";
  const hoverColor = side === "buy" ? "hover:bg-blue-600" : "hover:bg-red-600";

  return (
    <button
      onClick={onSubmit}
      disabled={disabled}
      className={`w-full py-2 mt-2 rounded text-white text-sm font-semibold transition-colors ${
        disabled ? "bg-gray-300 cursor-not-allowed" : `${bgColor} ${hoverColor}`
      }`}
    >
      주문하기
    </button>
  );
};

export default SubmitButton;
