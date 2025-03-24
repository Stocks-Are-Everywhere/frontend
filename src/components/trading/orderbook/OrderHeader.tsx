interface OrderHeaderProps {
  code: string;
  name: string;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ code, name }) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-gray-800">{code}</span>
        <span className="text-sm text-gray-500">{name}</span>
      </div>
    </div>
  );
};

export default OrderHeader;
