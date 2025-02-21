import '@testing-library/jest-dom';
import { WebSocket } from 'mock-socket';

// 전역 WebSocket 설정
(global as any).WebSocket = WebSocket;
