import React from "react";
import TradeHistoryList from "../../components/TradeHistory"
import OrderBook from "../../components/OrderBook";
import StockChart from "../../components/StockChart";

const OrderPage : React.FC = () => {
    return (
        <div>
            <OrderBook />
            <TradeHistoryList />
            <StockChart />
        </div>
    ); 
}

export default OrderPage;