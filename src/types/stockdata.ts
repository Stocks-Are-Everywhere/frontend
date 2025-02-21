export interface StockData {
  time: string; // 체결 시각
  currentPrice: number; // 현재가
  openPrice: number; // 시가
  highPrice: number; // 고가
  lowPrice: number; // 저가
  volume: number; // 체결량
  accVolume: number; // 누적거래량
  changeSign: null | string; // 전일대비구분
  changePrice: number; // 전일대비
  changeRate: number; // 등락률
  askPrice: number; // 매도호가
  bidPrice: number; // 매수호가
  askVolume: number; // 매도잔량
  bidVolume: number; // 매수잔량
}
