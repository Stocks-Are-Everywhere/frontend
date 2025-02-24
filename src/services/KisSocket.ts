import { useEffect, useState } from "react";

function parseMessage(res: string) {
    return Number.parseInt(res.split("|")[3].split("^")[2]);
}

const useStockPrice = (companyCode: string) => {
    const [price, setPrice] = useState<number | 0>(0);
  const socketUrl = "ws://ops.koreainvestment.com:31000";

  useEffect(() => {
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log("WebSocket 연결 성공");

      // API 요구사항에 맞게 구독 요청을 보냅니다.
      const subscribeMessage = {
        "header": {
            "approval_key": process.env.REACT_APP_APPROVAL_KEY,
            "custtype": "P",
            "tr_type": "1",
            "content-type": "utf-8"
        },
        "body": {
            "input":
            {
                     "tr_id": "H0STCNT0",
                     "tr_key": companyCode
            }
        }
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      const data = event.data;
      if (data.split('|')[0] == 0) {
        const realTimePrice : number = parseMessage(data);
        setPrice(realTimePrice); // 체결가 반영
      }
    };

    socket.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    return () => {
      socket.close();
    };
  }, [companyCode]);

  return price;
};

export default useStockPrice;
