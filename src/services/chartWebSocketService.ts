import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { ChartUpdateData, ChartResponseDto } from '../types/chart';

interface UseStockWebSocketProps {
  symbol: string;
  onPriceUpdate: (data: ChartUpdateData) => void;
  onCandleUpdate: (data: ChartResponseDto) => void; // ChartUpdateData에서 ChartResponseDto로 변경
}

export const useStockWebSocket = ({
  symbol,
  onPriceUpdate,
  onCandleUpdate,
}: UseStockWebSocketProps) => {
  const client = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    client.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.current.onConnect = () => {
      console.log('WebSocket Connected');

      client.current?.subscribe(`/topic/chart/${symbol}`, (message) => {
        try {
          const data = JSON.parse(message.body);
          onPriceUpdate(data);
        } catch (error) {
          console.error('Failed to parse price update:', error);
        }
      });

      client.current?.subscribe(`/topic/candle/${symbol}`, (message) => {
        try {
          const data = JSON.parse(message.body);
          onCandleUpdate(data);
        } catch (error) {
          console.error('Failed to parse candle update:', error);
        }
      });
    };

    client.current.activate();

    return () => {
      client.current?.deactivate();
    };
  }, [symbol, onPriceUpdate, onCandleUpdate]);

  return client.current;
};
