import { useEffect, useRef, useState, useCallback } from 'react';
import {
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  createChart,
} from 'lightweight-charts';
import axiosInstance from '../api/AxiosInstance';
import { useStockWebSocket } from '../services/chartWebSocketService';
import {
  ChartData,
  ChartUpdateData,
  ChartResponseDto,
} from '../types/chart';
import { CompanySearchResponse } from '../types/CompanySearchResponse';

export const TIME_FRAMES = [
  { code: '15s', display: '15초', apiCode: '15s' },
  { code: '1m', display: '1분', apiCode: '1m' },
  { code: '5m', display: '5분', apiCode: '5m' },
  { code: '15m', display: '15분', apiCode: '15m' },
  { code: '30m', display: '30분', apiCode: '30m' },
  { code: '1h', display: '1시간', apiCode: '1h' },
];

const debugLog = (msg: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Chart Debug] ${msg}`, data || '');
  }
};

const convertToChartTime = (timeValue: any): UTCTimestamp | null => {
  if (
    timeValue === null ||
    timeValue === undefined ||
    Number.isNaN(Number(timeValue)) ||
    Number(timeValue) <= 0
  ) {
    return null;
  }
  return Number(timeValue) as UTCTimestamp;
};

const createSafeChartData = (rawCandles: any[]): ChartData[] => {
  if (!Array.isArray(rawCandles)) return [];
  const result: ChartData[] = [];

  for (const candle of rawCandles) {
    const time = convertToChartTime(candle.time);
    if (!time) continue;

    const open = typeof candle.open === 'number' ? candle.open : 0;
    const high = typeof candle.high === 'number' ? candle.high : 0;
    const low = typeof candle.low === 'number' ? candle.low : 0;
    const close = typeof candle.close === 'number' ? candle.close : 0;
    const volume = typeof candle.volume === 'number' ? candle.volume : 0;

    if (open === 0 && high === 0 && low === 0 && close === 0) continue;

    result.push({ time, open, high, low, close, volume });
  }
  return result;
};

const getInitialTimeFrame = (): typeof TIME_FRAMES[number] => {
  const saved = localStorage.getItem("selectedTimeFrame");
  return TIME_FRAMES.find((t) => t.code === saved) || TIME_FRAMES[3]; // default to 15m
};

export function useRealTimeChart(companyData: CompanySearchResponse) {
  const CHART_SYMBOL = companyData.isuSrtCd;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const currentCandle = useRef<ChartData | null>(null);

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(getInitialTimeFrame);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("selectedTimeFrame", selectedTimeFrame.code);
  }, [selectedTimeFrame]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get<ChartResponseDto>(
          `/api/chart/${CHART_SYMBOL}/history?timeFrame=${selectedTimeFrame.apiCode}`
        );
        const candles = createSafeChartData(res.data?.candles || []);
        setChartData(candles);
        currentCandle.current = candles[candles.length - 1];
      } catch (err) {
        console.error(err);
        setError('초기 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [CHART_SYMBOL, selectedTimeFrame]);

  useEffect(() => {
    if (!chartContainerRef.current || isLoading || chartData.length === 0) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: { background: { color: '#fff' }, textColor: '#333' },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: { mode: 1 },
      rightPriceScale: {
        borderColor: '#ddd',
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        borderColor: '#ddd',
        timeVisible: true,
        secondsVisible: selectedTimeFrame.code === '15s' || selectedTimeFrame.code === '1m',
        fixLeftEdge: true,
        rightOffset: 5,
      },
    });

    chartRef.current = chart;
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#ef5350',
      downColor: '#5294f3',
      borderVisible: false,
      wickUpColor: '#ef5350',
      wickDownColor: '#5294f3',
    });
    candleSeriesRef.current = candleSeries;

    const volumeSeries = chart.addHistogramSeries({
      color: '#82b0f2',
      priceScaleId: 'volume',
      scaleMargins: { top: 0.85, bottom: 0.05 },
    });
    volumeSeriesRef.current = volumeSeries;

    candleSeries.setData(chartData);
    volumeSeries.setData(
      chartData.map((d) => ({
        time: d.time,
        value: d.volume || 0,
        color: d.close >= d.open ? 'rgba(239, 83, 80, 0.5)' : 'rgba(82, 148, 243, 0.5)',
      }))
    );

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [chartData, isLoading, selectedTimeFrame]);

  const change = (() => {
    if (!currentCandle.current || chartData.length < 1) return { value: 0, percent: 0 };
    const baseClose = chartData[0]?.close || 0;
    const currentClose = currentCandle.current.close;
    const diff = currentClose - baseClose;
    return {
      value: diff,
      percent: (diff / baseClose) * 100,
    };
  })();

  const getPriceColor = () => {
    if (!currentCandle.current || chartData.length < 2) return '#333';
    const prev = chartData[chartData.length - 2];
    const curr = currentCandle.current;
    if (curr.close > prev.close) return '#ef5350';
    if (curr.close < prev.close) return '#5294f3';
    return '#333';
  };

  useStockWebSocket({
    symbol: CHART_SYMBOL,
    timeFrame: selectedTimeFrame.apiCode,
    onPriceUpdate: () => {}, // implement
    onCandleUpdate: () => {}, // implement
  });

  return {
    chartContainerRef,
    chartData,
    currentCandle,
    isLoading,
    error,
    selectedTimeFrame,
    setSelectedTimeFrame,
    change,
    getPriceColor,
  };
}
