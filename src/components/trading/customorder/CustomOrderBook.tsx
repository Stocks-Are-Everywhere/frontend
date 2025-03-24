import React, { useState } from "react";
import { CompanySearchResponse } from "../../../types/CompanySearchResponse";
import OrderSideToggle from "./OrderSideToggle";
import PriceTypeSelector from "./PriceTypeSelector";
import OrderForm from "./OrderForm";
import SubmitButton from "./SubmitButton";
import FeedbackMessage from "./FeedbackMessage";

interface Props {
  companyData: CompanySearchResponse;
}

const CustomOrderBook: React.FC<Props> = ({ companyData }) => {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [priceType, setPriceType] = useState<"limit" | "market">("limit");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const handleSubmit = () => {
    if (priceType === "limit" && !price) {
      setMessage("가격을 입력해주세요.");
      setMessageType("error");
      return;
    }

    if (!quantity) {
      setMessage("수량을 입력해주세요.");
      setMessageType("error");
      return;
    }

    // Mock submission
    setTimeout(() => {
      setMessage(
        `${companyData.isuNm} ${side === "buy" ? "매수" : "매도"} 주문 완료!`
      );
      setMessageType("success");
      setPrice("");
      setQuantity("");
    }, 300);
  };

  return (
    <div className="w-[360px] mx-auto p-6 bg-white rounded-3xl shadow-md font-sans">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">주문</h2>

      <OrderSideToggle side={side} onChange={setSide} />

      <PriceTypeSelector priceType={priceType} onChange={setPriceType} />

      <OrderForm
        price={price}
        quantity={quantity}
        onPriceChange={setPrice}
        onQuantityChange={setQuantity}
        isPriceEditable={priceType === "limit"}
      />

      <SubmitButton
        onSubmit={handleSubmit}
        disabled={(priceType === "limit" && price === "") || quantity === ""}
        side={side}
      />

      {message && <FeedbackMessage message={message} type={messageType} />}
    </div>
  );
};

export default CustomOrderBook;
