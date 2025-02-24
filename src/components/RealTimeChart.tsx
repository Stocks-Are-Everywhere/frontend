import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import styled from 'styled-components';
import { Client } from '@stomp/stompjs';
import axiosInstance from '../api/AxiosInstance';
import { useStockWebSocket } from '../services/chartWebSocketService';
import { ChartData, ChartUpdateData, ChartResponseDto } from '../types/chart';

const CANDLE_INTERVAL = 15; // 15초 간격
const CHART_SYMBOL = '005930'; // 삼성전자

const RealTimeChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const currentCandle = useRef<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 전일 데이터
  const [prevClose, setPrevClose] = useState<number | null>(null);

  // 초기 데이터 불러오기
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<ChartResponseDto>(
          `/api/chart/${CHART_SYMBOL}/history`
        );

        if (!response.data.candles) {
          throw new Error('Invalid data format');
        }

        const formattedCandles = response.data.candles.map((candle) => ({
          ...candle,
          time: candle.time as Time,
        }));

        // 최근 30개 캔들만 유지
        const recentCandles = formattedCandles.slice(-30);
        setChartData(recentCandles);

        if (recentCandles.length > 0) {
          currentCandle.current = recentCandles[recentCandles.length - 1];
          setPrevClose(recentCandles[recentCandles.length - 2]?.close || null); // 전일 종가 설정
        }
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        setError('초기 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // 차트 초기화
  useEffect(() => {
    if (!chartContainerRef.current || isLoading || chartData.length === 0)
      return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#ddd',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        autoScale: true, // 자동 스케일링 활성화
      },
      timeScale: {
        borderColor: '#ddd',
        timeVisible: true,
        secondsVisible: true,
        fixLeftEdge: false, // 왼쪽 경계 고정
        fixRightEdge: false, // 오른쪽 경계 고정
        minBarSpacing: 3, // 최소 캔들 간격
      },
    });

    chartRef.current = chart;

    // 캔들스틱 시리즈 생성
    const series = chart.addCandlestickSeries({
      upColor: '#ef5350', // 양봉 색상 (상승)
      downColor: '#26a69a', // 음봉 색상 (하락)
      borderVisible: false,
      wickUpColor: '#ef5350',
      wickDownColor: '#26a69a',
    });

    candlestickSeriesRef.current = series;
    series.setData(chartData);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [chartData, isLoading]);

  // WebSocket 이벤트 핸들러
  const handlePriceUpdate = useCallback((data: ChartUpdateData) => {
    if (currentCandle.current && candlestickSeriesRef.current) {
      // 현재 캔들 업데이트
      const updatedCandle = {
        ...currentCandle.current,
        high: Math.max(currentCandle.current.high, data.price),
        low: Math.min(currentCandle.current.low, data.price),
        close: data.price,
        volume: currentCandle.current.volume + data.volume,
      };

      // 차트 데이터 업데이트
      setChartData((prevData) => {
        const newData = [...prevData];
        newData[newData.length - 1] = updatedCandle;
        return newData;
      });

      currentCandle.current = updatedCandle;
      candlestickSeriesRef.current.update(updatedCandle);
    }
  }, []);

  const handleCandleUpdate = useCallback((data: ChartResponseDto) => {
    if (data.candles && data.candles.length > 0) {
      const formattedCandles = data.candles.map((candle) => ({
        ...candle,
        time: candle.time as Time,
      }));

      // 새로운 캔들이 생성될 때만 데이터 추가
      setChartData((prevData) => {
        const lastCandle = prevData[prevData.length - 1];
        const newCandle = formattedCandles[formattedCandles.length - 1];

        if (lastCandle && lastCandle.time === newCandle.time) {
          // 현재 캔들 업데이트
          return [...prevData.slice(0, -1), newCandle];
        } else {
          // 새로운 캔들 추가
          const newData = [...prevData, newCandle];
          // 최대 30개 캔들 유지
          return newData.slice(-30);
        }
      });

      // 현재 캔들 참조 업데이트
      currentCandle.current = formattedCandles[formattedCandles.length - 1];

      // 차트 업데이트
      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(formattedCandles);
      }
    }
  }, []);

  // WebSocket 연결
  useStockWebSocket({
    symbol: CHART_SYMBOL,
    onPriceUpdate: handlePriceUpdate,
    onCandleUpdate: handleCandleUpdate,
  });

  // 주식 가격 변화 색상 결정
  const getPriceColor = () => {
    if (!currentCandle.current || !chartData.length) return '#333';

    const previousCandle = chartData[chartData.length - 2];
    if (!previousCandle) return '#333';

    if (currentCandle.current.close > previousCandle.close) return '#ef5350'; // 상승
    if (currentCandle.current.close < previousCandle.close) return '#26a69a'; // 하락
    return '#333'; // 변동 없음
  };

  // 가격 변화량 및 변화율 계산
  const calculateChange = () => {
    if (!currentCandle.current || !chartData.length)
      return { value: 0, percent: 0 };

    // "전일 종가"를 첫 번째 캔들의 close 값으로 설정
    const prevClose = chartData[0]?.close || 0;
    if (prevClose === 0) return { value: 0, percent: 0 };

    const previousCandle = chartData[chartData.length - 2];
    if (!previousCandle) return { value: 0, percent: 0 };

    const change = currentCandle.current.close - prevClose;
    const percent = (change / prevClose) * 100;

    return {
      value: change,
      percent: percent,
    };
  };

  const change = calculateChange();

  return (
    <ChartContainer>
      <ChartHeader>
        <SymbolInfo>
          <SymbolName>삼성전자 (005930)</SymbolName>
          <Exchange>KOSPI</Exchange>
        </SymbolInfo>
      </ChartHeader>

      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : isLoading ? (
        <LoadingMessage>차트 데이터를 불러오는 중입니다...</LoadingMessage>
      ) : (
        <>
          <div
            ref={chartContainerRef}
            style={{ width: '100%', height: '500px' }}
          />
          <ChartInfo>
            <InfoGrid>
              <InfoItem>
                <Label>현재가</Label>
                <Value style={{ color: getPriceColor() }}>
                  {currentCandle.current?.close
                    ? currentCandle.current.close.toLocaleString()
                    : '-'}
                  원
                </Value>
              </InfoItem>
              <InfoItem>
                <Label>전일 대비</Label>
                <ChangeValue positive={change.value >= 0}>
                  {change.value >= 0 ? '+' : ''}
                  {change.value.toFixed(2)} ({change.value >= 0 ? '+' : ''}
                  {change.percent.toFixed(2)}%)
                </ChangeValue>
              </InfoItem>
              <InfoItem>
                <Label>거래량</Label>
                <Value>
                  {currentCandle.current?.volume
                    ? currentCandle.current.volume.toLocaleString()
                    : '-'}
                  주
                </Value>
              </InfoItem>
              <InfoItem>
                <Label>시가</Label>
                <Value>
                  {currentCandle.current?.open
                    ? currentCandle.current.open.toLocaleString()
                    : '-'}
                  원
                </Value>
              </InfoItem>
            </InfoGrid>
          </ChartInfo>
        </>
      )}

      <ChartFooter>
        <Legend>
          <LegendItem color="#ef5350">상승</LegendItem>
          <LegendItem color="#26a69a">하락</LegendItem>
        </Legend>
        <ChartInfo>
          <small>15초 간격 캔들 차트 | 최근 30개 캔들 표시</small>
        </ChartInfo>
      </ChartFooter>
    </ChartContainer>
  );
};

// Styled Components
const ChartContainer = styled.div`
  width: 800px;
  max-width: 1000px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SymbolInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SymbolName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const Exchange = styled.div`
  font-size: 12px;
  color: #666;
`;

const ChartInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.span`
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
`;

const Value = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ChangeValue = styled.span<{ positive: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.positive ? '#ef5350' : '#26a69a')};
`;

const ErrorMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #d32f2f;
  font-size: 16px;
`;

const LoadingMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

const ChartFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  font-size: 12px;
  color: #777;
`;

const Legend = styled.div`
  display: flex;
  gap: 10px;
`;

const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  &:before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    background: ${(props) => props.color};
    margin-right: 5px;
  }
`;

export default RealTimeChart;
