interface CurrentPricePanelProps {
  price: number;
  diff: number;
  percent: number;
  direction: "up" | "down" | "neutral";
}

const CurrentPricePanel: React.FC<CurrentPricePanelProps> = ({
  price,
  diff,
  percent,
  direction,
}) => {
  const color =
    direction === "up"
      ? "text-red-500"
      : direction === "down"
      ? "text-blue-500"
      : "text-gray-800";

  const sign = direction === "up" ? "+" : direction === "down" ? "-" : "";

  return (
    <div className="text-center py-3">
      <div className={`text-xl font-bold ${color}`}>
        {price.toLocaleString()}원
      </div>
      <div className={`text-sm font-medium ${color}`}>
        {sign}
        {diff.toLocaleString()} ({sign}
        {percent.toFixed(2)}%)
      </div>
    </div>
  );
};

export default CurrentPricePanel;
