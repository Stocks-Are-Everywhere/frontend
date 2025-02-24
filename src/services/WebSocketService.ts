// src/services/WebSocketService.ts

import { OrderBookData } from '../types/orderbook';

class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private subscriptions: Map<string, (data: any) => void>;

  private constructor() {
    this.subscriptions = new Map();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(): void {
    // 순수 WebSocket 연결 (STOMP/SockJS 미사용)
    this.socket = new WebSocket('ws://localhost:8080/ws/trades');

    this.socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        // 연결 성공 메시지 처리
        if (data.message === 'WebSocket connection successful') {
          console.log('WebSocket 연결 성공');
          // 구독자에게 전달할 필요가 없으면 return
          // (원한다면 이 메시지도 전달 가능)
          return;
        }
        // 모든 구독자에게 데이터 전달
        this.subscriptions.forEach((callback) => {
          callback(data);
        });
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // topic은 인터페이스 호환용이며, 모든 메시지를 단일 채널에서 처리합니다.
  public subscribe(topic: string, callback: (data: any) => void): void {
    this.subscriptions.set(topic, callback);
  }
}

export default WebSocketService;
