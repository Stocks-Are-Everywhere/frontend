import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChartUpdateData, ChartResponseDto } from '../types/chart';

// WebSocket 서버 URL - 환경 변수에서 가져오거나 기본값 사용
const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080/ws';

interface StockWebSocketProps {
  symbol: string;
  timeFrame?: string;
  onPriceUpdate: (data: ChartUpdateData) => void;
  onCandleUpdate: (data: ChartResponseDto) => void;
}

export const useStockWebSocket = ({
  symbol,
  timeFrame = '15m',
  onPriceUpdate,
  onCandleUpdate,
}: StockWebSocketProps) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    // 이전 연결 정리
    if (clientRef.current && clientRef.current.connected) {
      console.log('Disconnecting previous WebSocket connection');
      clientRef.current.deactivate();
    }

    console.log(
      `Setting up WebSocket connection for ${symbol}, timeFrame: ${timeFrame}`
    );

    // 새로운 STOMP 클라이언트 생성
    const client = new Client({
      // WebSocket 직접 연결 대신 SockJS 사용
      webSocketFactory: () => new SockJS(WS_URL),
      debug: function (str) {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('WebSocket connected successfully');

      // 일반 차트 업데이트 구독 (실시간 거래)
      const chartTopic = `/topic/chart/${symbol}`;
      console.log(`Subscribing to chart updates: ${chartTopic}`);
      client.subscribe(chartTopic, (message) => {
        console.log('Received price update message:', message.body);
        try {
          const data: ChartUpdateData = JSON.parse(message.body);
          onPriceUpdate(data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      // 특정 타임프레임 차트 업데이트 구독
      const timeframeTopic = `/topic/chart/${symbol}/${timeFrame}`;
      console.log(`Subscribing to timeframe updates: ${timeframeTopic}`);
      client.subscribe(timeframeTopic, (message) => {
        console.log('Received timeframe update message:', message.body);
        try {
          const data: ChartUpdateData = JSON.parse(message.body);
          onPriceUpdate(data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      // 새 캔들 생성 시 업데이트 구독
      const candleTopic = `/topic/candle/${symbol}/${timeFrame}`;
      console.log(`Subscribing to candle updates: ${candleTopic}`);
      client.subscribe(candleTopic, (message) => {
        console.log('Received candle message:', message.body);
        try {
          const data: ChartResponseDto = JSON.parse(message.body);
          onCandleUpdate(data);
        } catch (error) {
          console.error('Error parsing candle message:', error);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
    };

    client.onWebSocketError = (event) => {
      console.error('WebSocket Error:', event);
    };

    client.onDisconnect = () => {
      console.log('WebSocket disconnected');
    };

    // STOMP 클라이언트 활성화
    console.log('Activating WebSocket connection');
    client.activate();
    clientRef.current = client;

    // 정리 함수
    return () => {
      console.log('Cleaning up WebSocket connection');
      if (clientRef.current && clientRef.current.connected) {
        clientRef.current.deactivate();
      }
    };
  }, [symbol, timeFrame, onPriceUpdate, onCandleUpdate]);
};
