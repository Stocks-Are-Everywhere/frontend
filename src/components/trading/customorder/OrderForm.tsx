interface Props {
  price: string;
  quantity: string;
  onPriceChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  isPriceEditable: boolean;
}

const OrderForm: React.FC<Props> = ({
  price,
  quantity,
  onPriceChange,
  onQuantityChange,
  isPriceEditable,
}) => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* 가격 입력 */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">가격</label>
        <input
          type="number"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          disabled={!isPriceEditable}
          className={`w-full px-3 py-2 text-sm rounded border ${
            isPriceEditable
              ? "border-gray-300 focus:outline-blue-500"
              : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          }`}
          placeholder={isPriceEditable ? "가격 입력" : "시장가 주문입니다"}
        />
      </div>

      {/* 수량 입력 */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">수량</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded border border-gray-300 focus:outline-blue-500"
          placeholder="수량 입력"
        />
      </div>
    </div>
  );
};

export default OrderForm;
