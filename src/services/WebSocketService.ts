import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { OrderBookData } from '../types/orderbook';

class WebSocketService {
  private static instance: WebSocketService;
  private client: Client;
  private subscriptions: Map<string, (data: any) => void>;

  private constructor() {
    this.subscriptions = new Map();
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
      this.subscribeToTopics();
    };

    this.client.onStompError = (frame) => {
      console.error('WebSocket Error:', frame);
    };
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(): void {
    this.client.activate();
  }

  public disconnect(): void {
    this.client.deactivate();
  }

  public subscribe(
    topic: string,
    callback: (data: OrderBookData) => void
  ): void {
    this.subscriptions.set(topic, callback);

    if (this.client.connected) {
      this.subscribeToTopic(topic, callback);
    }
  }

  private subscribeToTopics(): void {
    this.subscriptions.forEach((callback, topic) => {
      this.subscribeToTopic(topic, callback);
    });
  }

  private subscribeToTopic(
    topic: string,
    callback: (data: OrderBookData) => void
  ): void {
    this.client.subscribe(topic, (message) => {
      const data = JSON.parse(message.body);
      callback(data);
    });
  }
}

export default WebSocketService;
