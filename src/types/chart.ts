import { Time } from 'lightweight-charts';

export interface ChartData {
  time: Time; // Time 타입 사용
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartUpdateData {
  price: number;
  volume: number;
}

export interface ChartResponseDto {
  candles: ChartData[];
}
