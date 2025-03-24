type LevelType = "buy" | "sell";

interface QuantityBarProps {
  width: number; // percentage from 0 to 100
  type: LevelType;
}

const QuantityBar: React.FC<QuantityBarProps> = ({ width, type }) => {
  const barColor = type === "buy" ? "bg-blue-100/50" : "bg-red-100/50";

  return (
    <div
      className={`absolute inset-0 ${barColor} z-0`}
      style={{
        width: `${width}%`,
        left: type === "buy" ? "50%" : "0",
      }}
    />
  );
};

export default QuantityBar;
