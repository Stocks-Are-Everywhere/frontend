import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
} from 'lightweight-charts';
import styled from 'styled-components';
import axiosInstance from '../api/AxiosInstance';
import { useStockWebSocket } from '../services/chartWebSocketService';
import {
  CandleDto,
  ChartData,
  ChartUpdateData,
  ChartResponseDto,
} from '../types/chart';
import { CompanySearchResponse } from '../types/CompanySearchResponse';

interface OrderBookProps {
  companyData: CompanySearchResponse;
}

// 타임프레임 정의
const TIME_FRAMES = [
  { code: '15s', display: '15초', apiCode: '15s' },
  { code: '1m', display: '1분', apiCode: '1m' },
  { code: '5m', display: '5분', apiCode: '5m' },
  { code: '15m', display: '15분', apiCode: '15m' },
  { code: '30m', display: '30분', apiCode: '30m' },
  { code: '1h', display: '1시간', apiCode: '1h' },
];

// 디버그 로그 유틸리티
const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Chart Debug] ${message}`, data || '');
  }
};

// 시간 변환 유틸리티 함수 - UTCTimestamp 사용
const convertToChartTime = (timeValue: any): UTCTimestamp | null => {
  // null, undefined, NaN 체크
  if (
    timeValue === null ||
    timeValue === undefined ||
    Number.isNaN(Number(timeValue))
  ) {
    console.warn('유효하지 않은 시간값:', timeValue);
    return null;
  }

  const timeNum = Number(timeValue);

  // 음수나 0 체크
  if (timeNum <= 0) {
    console.warn('유효하지 않은 시간값 (0 이하):', timeNum);
    return null;
  }

  return timeNum as UTCTimestamp;
};

// 안전한 캔들 데이터 생성 함수
const createSafeChartData = (rawCandles: any[]): ChartData[] => {
  // 입력이 배열이 아닌 경우 처리
  if (!Array.isArray(rawCandles)) {
    console.warn('캔들 데이터가 배열이 아닙니다:', typeof rawCandles);
    return [];
  }

  debugLog('원본 캔들 데이터 (처음 2개):', rawCandles.slice(0, 2));

  const result: ChartData[] = [];

  // 각 캔들 데이터를 안전하게 처리
  for (const candle of rawCandles) {
    // 캔들이 객체가 아니면 스킵
    if (!candle || typeof candle !== 'object') {
      continue;
    }

    // 시간값 처리
    const timeValue = convertToChartTime(candle.time);
    if (timeValue === null) {
      debugLog('유효하지 않은 시간값 스킵:', candle.time);
      continue;
    }

    // 가격 데이터 유효성 확인
    const open =
      typeof candle.open === 'number' && !isNaN(candle.open) ? candle.open : 0;
    const high =
      typeof candle.high === 'number' && !isNaN(candle.high) ? candle.high : 0;
    const low =
      typeof candle.low === 'number' && !isNaN(candle.low) ? candle.low : 0;
    const close =
      typeof candle.close === 'number' && !isNaN(candle.close)
        ? candle.close
        : 0;
    const volume =
      typeof candle.volume === 'number' && !isNaN(candle.volume)
        ? candle.volume
        : 0;

    // 모든 필드가 0이면 무효한 데이터로 간주
    if (open === 0 && high === 0 && low === 0 && close === 0) {
      debugLog('모든 가격 필드가 0인 데이터 스킵:', candle);
      continue;
    }

    // 유효한 캔들 데이터를 결과 배열에 추가
    result.push({
      time: timeValue,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  // 시간순으로 정렬
  // const sortedResult = result.sort((a, b) => Number(a.time) - Number(b.time));

  if (result.length > 0) {
    debugLog('변환된 캔들 데이터 (처음 2개):', result.slice(0, 2));
  } else {
    debugLog('유효한 캔들 데이터가 없습니다');
  }

  return result;
};

const RealTimeChart: React.FC<OrderBookProps> = ({ companyData }) => {
  const CHART_SYMBOL = companyData.isuSrtCd;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const currentCandle = useRef<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<
    (typeof TIME_FRAMES)[0]
  >(TIME_FRAMES[3]); // 기본값 15분
  const [prevClose, setPrevClose] = useState<number | null>(null);

  // 초기 데이터 불러오기
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<ChartResponseDto>(
          `/api/chart/${CHART_SYMBOL}/history?timeFrame=${selectedTimeFrame.apiCode}`
        );

        if (
          !response.data ||
          !response.data.candles ||
          !Array.isArray(response.data.candles)
        ) {
          throw new Error('Invalid data format');
        }

        debugLog('서버에서 받은 원본 캔들 데이터:', response.data);

        // 안전한 방식으로 캔들 데이터 변환
        const formattedCandles = createSafeChartData(response.data.candles);

        if (formattedCandles.length === 0) {
          throw new Error('No valid candle data available');
        }

        setChartData(formattedCandles);
        debugLog('차트에 설정된 데이터 (길이):', formattedCandles.length);

        if (formattedCandles.length > 0) {
          currentCandle.current = formattedCandles[formattedCandles.length - 1];

          if (formattedCandles.length > 1) {
            setPrevClose(
              formattedCandles[formattedCandles.length - 2]?.close || null
            );
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        setError('초기 데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [selectedTimeFrame]);

  // 차트 초기화
  useEffect(() => {
    if (!chartContainerRef.current || isLoading || chartData.length === 0)
      return;

    // 기존 차트가 있다면 제거
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    try {
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
            bottom: 0.2,
          },
          autoScale: true,
        },
        timeScale: {
          borderColor: '#ddd',
          timeVisible: true,
          secondsVisible:
            selectedTimeFrame.code === '15s' || selectedTimeFrame.code === '1m',
          fixLeftEdge: true,
          rightOffset: 5,
        },
      });

      chartRef.current = chart;

      // 캔들스틱 시리즈 생성
      const candleSeries = chart.addCandlestickSeries({
        upColor: '#ef5350',
        downColor: '#5294f3',
        borderVisible: false,
        wickUpColor: '#ef5350',
        wickDownColor: '#5294f3',
      });

      candlestickSeriesRef.current = candleSeries;

      // 볼륨 시리즈 추가
      const volumeSeries = chart.addHistogramSeries({
        color: '#82b0f2',
        priceScaleId: 'volume',
        scaleMargins: {
          top: 0.85,
          bottom: 0.05,
        },
      });
      volumeSeriesRef.current = volumeSeries;

      debugLog(
        '시간 값 샘플 (처음 5개):',
        chartData.slice(0, 5).map((c) => c.time)
      );

      try {
        // null 시간 값을 가진 데이터가 없는지 한 번 더 확인
        const validData = chartData.filter(
          (candle) => candle.time !== null && candle.time !== undefined
        );

        if (validData.length !== chartData.length) {
          debugLog(
            `${
              chartData.length - validData.length
            }개의 유효하지 않은 데이터 제외됨`
          );
        }

        // 캔들스틱 시리즈에 데이터 설정
        candleSeries.setData(validData);

        // 볼륨 데이터 설정
        const volumeData = validData.map((d) => ({
          time: d.time,
          value: d.volume || 0,
          color:
            d.close >= d.open
              ? 'rgba(239, 83, 80, 0.5)'
              : 'rgba(82, 148, 243, 0.5)',
        }));

        volumeSeries.setData(volumeData);

        // 자동 스케일 조정
        chart.timeScale().fitContent();
      } catch (err) {
        console.error('차트 데이터 설정 오류:', err);
        debugLog('차트 데이터 설정 실패:', {
          error: err,
          chartData: chartData.slice(0, 3),
          times: chartData.slice(0, 5).map((c) => c.time),
        });
      }

      debugLog('차트 초기화 완료');
    } catch (err) {
      console.error('차트 초기화 오류:', err);
      setError(
        '차트를 초기화하는데 실패했습니다: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }

    // 윈도우 리사이즈 핸들러
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

  // 가격 업데이트 핸들러
  const handlePriceUpdate = useCallback(
    (data: ChartUpdateData) => {
      // 타임프레임 코드 체크 (타임프레임별 업데이트 처리)
      if (
        !data ||
        (data.timeCode && data.timeCode !== selectedTimeFrame.apiCode)
      ) {
        return; // 현재 선택된 타임프레임이 아니면 무시
      }

      debugLog('가격 업데이트 수신', data);

      // 필수 조건 확인
      if (
        !currentCandle.current ||
        !candlestickSeriesRef.current ||
        !chartRef.current ||
        data.price === null ||
        data.price === undefined ||
        isNaN(data.price)
      ) {
        debugLog('가격 업데이트 처리 불가: 필수 데이터/참조 누락', {
          hasCurrentCandle: !!currentCandle.current,
          hasCandlestickSeries: !!candlestickSeriesRef.current,
          hasChartRef: !!chartRef.current,
          price: data.price,
        });
        return;
      }

      try {
        // 시간 확인 - 백엔드에서 제공하는 시간 데이터 사용
        const timeToUse = data.time
          ? convertToChartTime(data.time)
          : currentCandle.current.time;

        // 유효성 검사
        if (!timeToUse) {
          debugLog('유효하지 않은 시간 값', data.time);
          return;
        }

        // 현재 시간과 업데이트 시간이 다르면 새 캔들을 생성해야 하지만
        // 여기서는 무시하고 handleCandleUpdate에서 처리
        if (timeToUse !== currentCandle.current.time) {
          debugLog('시간 불일치로 업데이트 무시', {
            currentTime: currentCandle.current.time,
            updateTime: timeToUse,
          });
          return;
        }

        // 올바른 숫자 데이터가 있는지 확인
        const safeHigh =
          typeof currentCandle.current.high === 'number' &&
          !isNaN(currentCandle.current.high)
            ? currentCandle.current.high
            : data.price;
        const safeLow =
          typeof currentCandle.current.low === 'number' &&
          !isNaN(currentCandle.current.low)
            ? currentCandle.current.low
            : data.price;

        const updatedCandle: ChartData = {
          ...currentCandle.current,
          time: timeToUse,
          high: Math.max(safeHigh, data.price),
          low: Math.min(safeLow, data.price),
          close: data.price,
          volume:
            data.volume !== undefined &&
            data.volume !== null &&
            !isNaN(data.volume)
              ? data.volume
              : currentCandle.current.volume || 0,
        };

        // 완전한 데이터인지 확인
        if (
          typeof updatedCandle.open !== 'number' ||
          isNaN(updatedCandle.open) ||
          typeof updatedCandle.high !== 'number' ||
          isNaN(updatedCandle.high) ||
          typeof updatedCandle.low !== 'number' ||
          isNaN(updatedCandle.low) ||
          typeof updatedCandle.close !== 'number' ||
          isNaN(updatedCandle.close)
        ) {
          debugLog(
            '유효하지 않은 업데이트 캔들 (숫자 데이터 누락)',
            updatedCandle
          );
          return;
        }

        setChartData((prevData: ChartData[]) => {
          if (!prevData || prevData.length === 0) return prevData;

          const newData = [...prevData];
          newData[newData.length - 1] = updatedCandle;
          return newData;
        });

        currentCandle.current = updatedCandle;

        // 차트 업데이트
        try {
          candlestickSeriesRef.current.update({
            time: updatedCandle.time,
            open: updatedCandle.open,
            high: updatedCandle.high,
            low: updatedCandle.low,
            close: updatedCandle.close,
          });
        } catch (err) {
          console.error('캔들스틱 업데이트 오류:', err);
          debugLog('캔들스틱 업데이트 실패', { updatedCandle, error: err });
        }

        // 볼륨 업데이트
        if (volumeSeriesRef.current) {
          try {
            volumeSeriesRef.current.update({
              time: updatedCandle.time,
              value:
                typeof updatedCandle.volume === 'number' &&
                !isNaN(updatedCandle.volume)
                  ? updatedCandle.volume
                  : 0,
              color:
                updatedCandle.close >= updatedCandle.open
                  ? 'rgba(239, 83, 80, 0.5)'
                  : 'rgba(82, 148, 243, 0.5)',
            });
          } catch (err) {
            console.error('볼륨 업데이트 오류:', err);
          }
        }

        debugLog('캔들 업데이트 완료', updatedCandle);
      } catch (err) {
        console.error('캔들 업데이트 오류:', err);
        debugLog('캔들 업데이트 중 오류 발생', err);
      }
    },
    [selectedTimeFrame, companyData.isuSrtCd]
  );

  // 캔들 업데이트 핸들러
  const handleCandleUpdate = useCallback(
    (data: ChartResponseDto) => {
      // 타임프레임 코드 체크
      if (
        !data ||
        !data.candles ||
        !Array.isArray(data.candles) ||
        (data.timeCode && data.timeCode !== selectedTimeFrame.apiCode)
      ) {
        debugLog(
          '캔들 업데이트 무시: 잘못된 데이터 형식 또는 타임프레임 불일치',
          {
            hasData: !!data,
            hasCandles: data?.candles ? true : false,
            isArray: data?.candles ? Array.isArray(data.candles) : false,
            timeCode: data?.timeCode,
            selectedTimeCode: selectedTimeFrame.apiCode,
          }
        );
        return;
      }

      debugLog('캔들 업데이트 수신', data);

      try {
        // 안전한 방식으로 캔들 데이터 변환
        const formattedCandles = createSafeChartData(data.candles);

        if (formattedCandles.length === 0) {
          debugLog('유효한 캔들 없음');
          return;
        }

        // 새로운 캔들이 생성될 때만 데이터 추가
        setChartData((prevData: ChartData[]) => {
          if (!prevData || prevData.length === 0) return formattedCandles;

          const lastCandle = prevData[prevData.length - 1];
          const newCandle = formattedCandles[formattedCandles.length - 1];

          if (
            !lastCandle ||
            !newCandle ||
            lastCandle.time === undefined ||
            newCandle.time === undefined
          ) {
            debugLog('유효하지 않은 캔들 비교', { lastCandle, newCandle });
            return prevData;
          }

          if (lastCandle.time === newCandle.time) {
            // 현재 캔들 업데이트
            return [...prevData.slice(0, -1), newCandle];
          } else {
            // 새로운 캔들 추가
            const newData = [...prevData, newCandle];
            // 최대 100개 캔들 유지
            return newData.slice(-100);
          }
        });

        // 현재 캔들 참조 업데이트
        if (formattedCandles.length > 0) {
          currentCandle.current = formattedCandles[formattedCandles.length - 1];
        }

        // 차트 업데이트
        if (
          candlestickSeriesRef.current &&
          volumeSeriesRef.current &&
          formattedCandles.length > 0
        ) {
          try {
            // 캔들 시리즈 업데이트
            candlestickSeriesRef.current.setData(formattedCandles);

            // 볼륨 데이터 업데이트
            const volumeData = formattedCandles.map((d: ChartData) => ({
              time: d.time,
              value: d.volume || 0,
              color:
                d.close >= d.open
                  ? 'rgba(239, 83, 80, 0.5)'
                  : 'rgba(82, 148, 243, 0.5)',
            }));

            volumeSeriesRef.current.setData(volumeData);

            // 차트 범위 조정
            if (chartRef.current) {
              chartRef.current.timeScale().fitContent();
            }
          } catch (err) {
            console.error('차트 데이터 설정 중 오류:', err);
            debugLog('차트 데이터 업데이트 오류', {
              error: err,
              formattedCandles: formattedCandles.slice(0, 3),
            });
          }

          debugLog('차트 데이터 업데이트 완료');
        }
      } catch (err) {
        console.error('차트 데이터 설정 오류:', err);
        debugLog('차트 데이터 업데이트 중 오류 발생', err);
      }
    },
    [selectedTimeFrame]
  );

  // WebSocket 연결
  useStockWebSocket({
    symbol: CHART_SYMBOL,
    timeFrame: selectedTimeFrame.apiCode,
    onPriceUpdate: handlePriceUpdate,
    onCandleUpdate: handleCandleUpdate,
  });

  // 타임프레임 변경 핸들러
  const handleTimeFrameChange = (timeFrame: (typeof TIME_FRAMES)[0]) => {
    setSelectedTimeFrame(timeFrame);
  };

  // 주식 가격 변화 색상 결정
  const getPriceColor = () => {
    if (!currentCandle.current || !chartData.length) return '#333';

    const previousCandle = chartData[chartData.length - 2];
    if (!previousCandle) return '#333';

    if (currentCandle.current.close > previousCandle.close) return '#ef5350'; // 상승
    if (currentCandle.current.close < previousCandle.close) return '#5294f3'; // 하락
    return '#333'; // 변동 없음
  };

  // 가격 변화량 및 변화율 계산
  const calculateChange = () => {
    if (!currentCandle.current || !chartData.length)
      return { value: 0, percent: 0 };

    // 첫 번째 캔들의 close 값을 기준으로 설정
    const baseClose = chartData[0]?.close || 0;
    if (baseClose === 0) return { value: 0, percent: 0 };

    const change = currentCandle.current.close - baseClose;
    const percent = (change / baseClose) * 100;

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
          <SymbolName>
            {companyData.isuNm} ({companyData.isuSrtCd})
          </SymbolName>
          <Exchange>KOSPI</Exchange>
        </SymbolInfo>
        <TimeFrameSelector>
          {TIME_FRAMES.map((tf) => (
            <TimeFrameButton
              key={tf.code}
              active={selectedTimeFrame.code === tf.code}
              onClick={() => handleTimeFrameChange(tf)}
            >
              {tf.display}
            </TimeFrameButton>
          ))}
        </TimeFrameSelector>
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
                <Label>기준가 대비</Label>
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
          <LegendItem color="#5294f3">하락</LegendItem>
        </Legend>
        <ChartInfo>
          <small>
            {selectedTimeFrame.display} 간격 캔들 차트 | 최근 100개 캔들 표시
          </small>
        </ChartInfo>
      </ChartFooter>
    </ChartContainer>
  );
};

// Styled Components
const ChartContainer = styled.div`
  width: 800px;
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
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

const TimeFrameSelector = styled.div`
  display: flex;
  gap: 5px;

  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 5px;
  }
`;

const TimeFrameButton = styled.button<{ active: boolean }>`
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: ${(props) => (props.active ? '600' : '400')};
  background-color: ${(props) => (props.active ? '#e0e0e0' : 'transparent')};
  border: 1px solid ${(props) => (props.active ? '#ccc' : '#e0e0e0')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? '#e0e0e0' : '#f5f5f5')};
  }
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
  color: ${(props) => (props.positive ? '#ef5350' : '#5294f3')};
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
