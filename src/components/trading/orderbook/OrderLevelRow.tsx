import QuantityBar from "./QuantityBar";

type LevelType = "buy" | "sell";
type ChangeType = "up" | "down" | "none";

interface Props {
  price: number;
  quantity: number;
  changeType: ChangeType;
  type: LevelType;
  maxQuantity: number;
}

const OrderLevelRow: React.FC<Props> = ({
  price,
  quantity,
  changeType,
  type,
  maxQuantity,
}) => {
  const priceColor =
    changeType === "up"
      ? "text-red-500"
      : changeType === "down"
      ? "text-blue-500"
      : "text-gray-800";

  const bg = type === "buy" ? "bg-blue-100/50" : "bg-red-100/50";

  const widthPercent = maxQuantity ? (quantity / maxQuantity) * 100 : 0;

  return (
    <div className="relative flex justify-between items-center py-1 px-2 text-sm font-medium text-right">
      {/* Quantity bar background */}
      <QuantityBar width={widthPercent} type={type} />

      {/* Quantity */}
      <div className="w-1/2 text-gray-600">{quantity.toLocaleString()}</div>

      {/* Price */}
      <div className={`w-1/2 ${priceColor}`}>{price.toLocaleString()}</div>
    </div>
  );
};

export default OrderLevelRow;
