import { UTCTimestamp } from 'lightweight-charts';

// 인터페이스 정의 - Time 대신 UTCTimestamp 사용
export interface CandleDto {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartData {
  time: UTCTimestamp; // UTCTimestamp 사용
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartUpdateData {
  price: number;
  volume?: number;
  time?: number;
  timeCode?: string;
}

export interface ChartResponseDto {
  candles: CandleDto[];
  timeCode?: string;
}
