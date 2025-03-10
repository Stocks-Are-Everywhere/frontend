export interface StockData {
  hts_kor_isnm: string;
  stck_prpr: string;
  prdy_ctrt: string;
}

export const dummyStockData: { [key: string]: StockData[] } = {
  volume: [
    { hts_kor_isnm: '삼성전자', stck_prpr: '70,000', prdy_ctrt: '2.5' },
    { hts_kor_isnm: 'SK하이닉스', stck_prpr: '120,000', prdy_ctrt: '1.8' },
    { hts_kor_isnm: '현대차', stck_prpr: '180,000', prdy_ctrt: '-0.5' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
  ],
  change: [
    { hts_kor_isnm: 'LG화학', stck_prpr: '650,000', prdy_ctrt: '5.2' },
    { hts_kor_isnm: '셀트리온', stck_prpr: '180,000', prdy_ctrt: '4.8' },
    {
      hts_kor_isnm: '삼성바이오로직스',
      stck_prpr: '750,000',
      prdy_ctrt: '4.5',
    },

    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
    { hts_kor_isnm: 'VolumeStock1', stck_prpr: '610,766', prdy_ctrt: '1.6' },
    { hts_kor_isnm: 'VolumeStock2', stck_prpr: '721,071', prdy_ctrt: '-1.0' },
    { hts_kor_isnm: 'VolumeStock3', stck_prpr: '771,433', prdy_ctrt: '-0.8' },
  ],
  marketCap: [
    { hts_kor_isnm: '삼성전자', stck_prpr: '70,000', prdy_ctrt: '0.8' },
    { hts_kor_isnm: 'SK하이닉스', stck_prpr: '120,000', prdy_ctrt: '1.2' },
    { hts_kor_isnm: 'NAVER', stck_prpr: '280,000', prdy_ctrt: '2.1' },
    // ... (더 많은 데이터 추가)
  ],
  marketValue: [
    { hts_kor_isnm: 'LG화학', stck_prpr: '650,000', prdy_ctrt: '1.8' },
    { hts_kor_isnm: '현대차', stck_prpr: '180,000', prdy_ctrt: '0.9' },
    { hts_kor_isnm: '셀트리온', stck_prpr: '180,000', prdy_ctrt: '2.2' },
    // ... (더 많은 데이터 추가)
  ],
  largeOrders: [
    { hts_kor_isnm: 'SK하이닉스', stck_prpr: '120,000', prdy_ctrt: '2.5' },
    { hts_kor_isnm: '삼성전자', stck_prpr: '70,000', prdy_ctrt: '1.2' },
    { hts_kor_isnm: 'POSCO', stck_prpr: '280,000', prdy_ctrt: '3.8' },
    // ... (더 많은 데이터 추가)
  ],
};

export const dummyMarketOverviewData = [
  { name: 'KOSPI', value: '2,576.16', change: '+18.03 (0.7%)', positive: true },
  { name: 'KOSDAQ', value: '734.92', change: '-12.03 (1.6%)', positive: false },
  {
    name: 'NASDAQ',
    value: '18,552.73',
    change: '+267.57 (1.4%)',
    positive: true,
  },
  {
    name: 'S&P 500',
    value: '5,842.63',
    change: '+64.48 (1.1%)',
    positive: true,
  },
];
