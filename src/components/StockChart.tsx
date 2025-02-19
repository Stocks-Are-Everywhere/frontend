import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

interface StockData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const StockChart: React.FC = () => {

    const [stockData, setStockData] = useState<StockData[]>([]);

    useEffect(() => {
      const generateSampleData = () => {
        const now = new Date();
        const data: StockData[] = [];
  
        for (let i = 0; i < 100; i++) {
          const time = new Date(now.getTime() - (99 - i) * 60000).toISOString();
          const open = 100 + Math.random() * 10;
          const high = open + Math.random() * 5;
          const low = open - Math.random() * 5;
          const close = open + Math.random() * 2 - 1;
          const volume = Math.floor(Math.random() * 1000);
          data.push({
            time,
            open,
            high,
            low,
            close,
            volume,
          });
        }
        
        setStockData(data);
      };

  
      return () => generateSampleData();
    }, []);

    const chartOptions : ApexOptions = {
        chart: {
          type: 'candlestick',
          height: 350,
        },
        grid: {
          strokeDashArray: 0,
          
          borderColor: '#f5f6f7',
          xaxis: {
            lines: {
              show: true,
            }
          }, 
          yaxis: {
            lines: {
              show: true,
            }
          }
        },
        title: {
          text: '삼성전자',
          align: 'left',
          style: {
            fontSize: '30px'
          }
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: "hh:mm"
          }, 
          tickAmount: 6,
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
          opposite: true,
          labels: {
            formatter: function (value) {
              return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
            }
          },
          axisBorder: {
            show: true
          },
          
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#f14452',
                    downward: '#3083f6'
                },
                wick: {
                    useFillColor: true
                }
            }
        }
      };


  const chartSeries = [
    {
      data: stockData.map((data) => [
        new Date(data.time).getTime(),
        data.open,
        data.high,
        data.low,
        data.close,
      ]),
    },
  ];

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="candlestick"
        height={700}
        width={600}
      />
    </div>
  );
};

export default StockChart;