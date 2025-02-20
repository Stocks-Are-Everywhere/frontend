import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import DistributionResFromApi from '../apis/DistributionChart';
import Distribution from '../apis/DistributionChart';
import {getTodayDistributionChart} from '../services/ChartService'

interface ChartProps {
  companyCode: string;
}

function StockChart({companyCode}: ChartProps) {

    const [stockData, setStockData] = useState<Distribution[]>([]);
    const [companyName, setCompanyName] = useState<string>();
    
    const generateSampleData = async () => {
      try {
        const data: Distribution[] = [];
  
        const res = await getTodayDistributionChart("903000", companyCode);

        const stockList: Distribution[] = res.output2.map((d: DistributionResFromApi) => ({
          time: new Date(`${d.stck_bsop_date.substring(0, 4)}-${d.stck_bsop_date.substring(4, 6)}-${d.stck_bsop_date.substring(6, 8)}T${d.stck_cntg_hour.substring(0, 2)}:${d.stck_cntg_hour.substring(2, 4)}:${d.stck_cntg_hour.substring(4, 6)}`).toISOString(), 
          open: Number(d.stck_oprc),
          high: Number(d.stck_hgpr),
          low: Number(d.stck_lwpr),
          close: Number(d.stck_prpr),
          volume: Number(d.cntg_vol),
        }))
        stockList.forEach((stockData: Distribution) => {data.push(stockData)});
        stockList.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setStockData(data);
        setCompanyName(res.output1.hts_kor_isnm)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    useEffect(() => {
      generateSampleData();
    }, []);

    const chartOptions : ApexOptions = {
        chart: {
          type: 'candlestick',
          height: 350,
          toolbar: {
            tools: {
              download: false
            }
          }
        },
        grid: {
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
          text: companyName,
          align: 'left',
          style: {
            fontSize: '20px'
          }
        },
        subtitle: {
          text: '58,300원',
          offsetX: 0,
          offsetY: 24,
          style: {
            fontSize: '18',
            color: "#373d3f"
          }
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: "hh:mm",
            style: {
              colors: '#acb3bc'
            }
          },
          
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
          opposite: true,
          labels: {
            formatter: function (value) {
              return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
            },
            style: {
              colors: '#acb3bc'
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
        },
        tooltip: {
          enabled: true,
          x: {
            show: true,
          },
          y: {
            formatter: (value) => value.toFixed(3),
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (value, { dataPointIndex, w }) => {
            const lastIndex = w.config.series[0].data.length-30;
            return dataPointIndex === lastIndex ? value.toLocaleString() : "";
          },
          offsetX: 13,
          style: {
            colors: ["#FF0000"],
          },
        },
      };
    const koreaTimeDiff = 9 * 60 * 60 * 1000; 
    const chartSeries = [
      {
        data: stockData.map((data) => [
          new Date(data.time).getTime() + koreaTimeDiff,
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