import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ISeriesApi,
  UTCTimestamp,
  ColorType,
} from 'lightweight-charts';
import { StockData as OriginalStockData } from '../types/stockdata';
import WebSocketService from '../services/WebSocketService';
import styled from 'styled-components';

interface ParsedStockData {
  time: UTCTimestamp;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  currentPrice: number;
  volume: number;
}

const LOCAL_STORAGE_KEY = 'chartData';

const StockChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [candlestickSeries, setCandlestickSeries] =
    useState<ISeriesApi<'Candlestick'> | null>(null);
  const [volumeSeries, setVolumeSeries] =
    useState<ISeriesApi<'Histogram'> | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<{
    amount: number;
    percent: number;
  } | null>(null);
  const [timeframe, setTimeframe] = useState<string>('1분');
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartElement = chartContainerRef.current;
    const chart = createChart(chartElement, {
      width: chartElement.clientWidth,
      height: chartElement.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333333',
        fontSize: 12,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(242, 244, 246, 1)' },
        horzLines: { color: 'rgba(242, 244, 246, 1)' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(242, 244, 246, 1)',
        tickMarkFormatter: (time: UTCTimestamp) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(242, 244, 246, 1)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: 'rgba(49, 130, 246, 0.3)',
          style: 2,
          labelBackgroundColor: '#333333',
        },
        horzLine: {
          width: 1,
          color: 'rgba(49, 130, 246, 0.3)',
          style: 2,
          labelBackgroundColor: '#333333',
        },
      },
    });

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !entries[0].contentRect) return;
      const newWidth = entries[0].contentRect.width;
      const newHeight = entries[0].contentRect.height;

      chart.applyOptions({
        width: newWidth,
        height: newHeight,
      });
    });

    resizeObserver.observe(chartElement);

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#3182f6',
      downColor: '#f03e3e',
      borderUpColor: '#3182f6',
      borderDownColor: '#f03e3e',
      wickUpColor: '#3182f6',
      wickDownColor: '#f03e3e',
    });

    const volumeSeries = chart.addHistogramSeries({
      color: '#3182f6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    setCandlestickSeries(candleSeries);
    setVolumeSeries(volumeSeries);

    // WebSocket 연결
    const ws = WebSocketService.getInstance<OriginalStockData>('stockchart');
    // StockData 인터페이스에 timestamp 추가
    interface StockData {
      time: string | number; // 또는 적절한 타입
      openPrice: number;
      highPrice: number;
      lowPrice: number;
      currentPrice: number;
      volume: number;
    }

    // 데이터 처리 부분
    ws.subscribe('/topic/stockdata/005930', (data: StockData) => {
      handleStockData({
        time: Math.floor(Date.now() / 1000) as UTCTimestamp, // 현재 시간을 사용하거나
        // 또는 data.time을 적절히 변환
        openPrice: data.currentPrice,
        highPrice: data.currentPrice,
        lowPrice: data.currentPrice,
        currentPrice: data.currentPrice,
        volume: 0,
      });
    });

    return () => {
      resizeObserver.disconnect();
      ws.disconnect();
      chart.remove();
    };
  }, []);
  const handleStockData = (data: ParsedStockData) => {
    if (!candlestickSeries || !volumeSeries) return;

    candlestickSeries.update({
      time: data.time,
      open: data.openPrice,
      high: data.highPrice,
      low: data.lowPrice,
      close: data.openPrice,
    });

    volumeSeries.update({
      time: data.time,
      value: data.volume,
    });

    setCurrentPrice(data.currentPrice);
    setPriceChange({
      amount: data.currentPrice - (data.openPrice || data.currentPrice),
      percent:
        ((data.currentPrice - (data.openPrice || data.currentPrice)) /
          (data.openPrice || data.currentPrice)) *
        100,
    });

    saveToLocalStorage(data);
  };

  const saveToLocalStorage = (data: ParsedStockData) => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedStoredData = storedData ? JSON.parse(storedData) : [];
      parsedStoredData.push(data);

      // 최근 1000개의 데이터만 유지
      if (parsedStoredData.length > 1000) {
        parsedStoredData.shift();
      }

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedStoredData));
    } catch (error) {
      console.error('Error saving to Local Storage:', error);
    }
  };

  useEffect(() => {
    const ws = WebSocketService.getInstance<OriginalStockData>('stockchart');
    ws.connect();

    ws.subscribe('/topic/stockdata/005930', (data) => {
      let parsedTime = parseInt(data.time);
      if (parsedTime > Math.pow(10, 10)) {
        parsedTime = Math.floor(parsedTime / 1000);
      }

      const utcTime = new Date(parsedTime * 1000);
      const kstTime = new Date(utcTime.getTime() + 9 * 60 * 60 * 1000);

      const parsedData = {
        time: Math.floor(kstTime.getTime() / 1000) as UTCTimestamp,
        openPrice: data.openPrice,
        highPrice: data.highPrice,
        lowPrice: data.lowPrice,
        currentPrice: data.currentPrice,
        volume: data.volume,
      };

      handleStockData(parsedData);
    });

    return () => ws.disconnect();
  }, [candlestickSeries, volumeSeries]);

  return (
    <Container>
      <Header>
        <StockInfo>
          <StockName>삼성전자</StockName>
          <StockCode>(005930)</StockCode>
        </StockInfo>
        <CurrentPriceWrapper>
          <CurrentPrice
            type={priceChange?.amount && priceChange.amount > 0 ? 'up' : 'down'}
          >
            ₩{currentPrice?.toLocaleString() || '-'}
          </CurrentPrice>
          {priceChange && (
            <ChangeInfo>
              <ChangeAmount type={priceChange.amount > 0 ? 'up' : 'down'}>
                {priceChange.amount > 0 ? '+' : ''}
                {priceChange.amount.toFixed(2)}
              </ChangeAmount>
              <ChangePercent type={priceChange.percent > 0 ? 'up' : 'down'}>
                ({priceChange.percent.toFixed(2)}%)
              </ChangePercent>
            </ChangeInfo>
          )}
        </CurrentPriceWrapper>
      </Header>

      <Toolbar>
        {['1분', '5분', '15분', '30분', '1시간', '1일'].map((tf) => (
          <TimeframeButton
            key={tf}
            active={timeframe === tf}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </TimeframeButton>
        ))}
      </Toolbar>

      <ChartSection>
        <ChartWrapper>
          <ChartContainer ref={chartContainerRef} />
        </ChartWrapper>
      </ChartSection>

      <Footer>데이터는 실시간으로 업데이트됩니다.</Footer>
    </Container>
  );
};

export default StockChart;

// 스타일 컴포넌트
const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f3f5;
`;

const TimeframeButton = styled.button<{ active: boolean }>`
  padding: 7px 14px;
  border: none;
  border-radius: 8px;
  background: ${(props) => (props.active ? '#3182f6' : '#f2f4f6')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.active ? '#1c7ed6' : '#e9ecef')};
  }
`;

const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  padding: 24px;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Footer = styled.div`
  padding: 16px 24px;
  color: #8b95a1;
  font-size: 13px;
  text-align: center;
  border-top: 1px solid #f1f3f5;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 2px 40px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f1f3f5;
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StockName = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const StockCode = styled.span`
  font-size: 14px;
  color: #8b95a1;
`;

const CurrentPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const CurrentPrice = styled.div<{ type?: 'up' | 'down' }>`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => (props.type === 'up' ? '#3182f6' : '#f03e3e')};
`;

const ChangeInfo = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ChangeAmount = styled.span<{ type: 'up' | 'down' }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.type === 'up' ? '#3182f6' : '#f03e3e')};
`;

const ChangePercent = styled(ChangeAmount)`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.type === 'up' ? '#3182f6' : '#f03e3e')};
`;

const ChartSection = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
`;
