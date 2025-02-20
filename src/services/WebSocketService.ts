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
    // 순수 WebSocket 연결 (STOMP/SockJS 사용하지 않음)
    this.socket = new WebSocket('ws://localhost:8080/ws/trades');

    this.socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        this.subscriptions.forEach(callback => {
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

  // 단일 채널의 모든 메시지를 처리하기 위해 topic은 인터페이스 호환용으로 남김
  public subscribe(topic: string, callback: (data: any) => void): void {
    this.subscriptions.set(topic, callback);
  }
}

export default WebSocketService;
