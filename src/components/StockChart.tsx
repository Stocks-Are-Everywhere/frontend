import { ApexOptions } from 'apexcharts';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import {DistributionResFromApi, Distribution} from '../apis/DistributionChart';
import {getTodayDistributionChart} from '../services/ChartService'
import useStockPrice from "../services/KisSocket";

interface ChartProps {
  companyCode: string;
}

function StockChart({companyCode}: ChartProps) {

    const [stockData, setStockData] = useState<Distribution[]>([]);
    const [companyName, setCompanyName] = useState<string>();
    const price = useStockPrice(companyCode);
    const today = new Date()
    
    const generateData = async () => {
      try {
        const data: Distribution[] = [];
        for(let i = 0; i < 4; i++) {
          const adjustedTime = new Date(today.getTime() - i * 30 * 60 * 1000);
          const hours = adjustedTime.getHours();
          const minutes = adjustedTime.getMinutes().toString().padStart(2, "0");
          const formattedDate = `${hours}${minutes}00`;
          let res = await getTodayDistributionChart(formattedDate, companyCode);
          let distribuitionData : DistributionResFromApi[] = res.output2;
          const stockList: Distribution[] = distribuitionData.map((d: DistributionResFromApi) => ({
            time: new Date(`${d.stck_bsop_date.substring(0, 4)}-${d.stck_bsop_date.substring(4, 6)}-${d.stck_bsop_date.substring(6, 8)}T${d.stck_cntg_hour.substring(0, 2)}:${d.stck_cntg_hour.substring(2, 4)}:${d.stck_cntg_hour.substring(4, 6)}`).toISOString(), 
            open: Number(d.stck_oprc),
            high: Number(d.stck_hgpr),
            low: Number(d.stck_lwpr),
            close: Number(d.stck_prpr),
            volume: Number(d.cntg_vol),
          }));

          stockList.forEach((stockData: Distribution) => {data.push(stockData)});
          setCompanyName(res.output1.hts_kor_isnm);
          if (i % 2 === 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
        setStockData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    useEffect(() => {
      generateData();
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
          text: `${price}원`,
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
        }
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