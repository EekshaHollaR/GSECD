import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import * as chrono from 'chrono-node';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
`;

const EnergyTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #9a3412; // Orange-800
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #4a5568;
  max-width: 800px;
  line-height: 1.6;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border-top: 4px solid #ea580c; // Orange-600
  transition: all 0.2s ease;
  height: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const FullWidthCard = styled(Card)`
  grid-column: 1 / -1;
  padding: 2rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
`;

const ChartContainer = styled.div`
  height: 450px;
  margin-bottom: 1rem;
`;

const SourceText = styled.p`
  color: #718096;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const ComingSoonBadge = styled.span`
  display: inline-block;
  background: #ffedd5;
  color: #9a3412;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 1rem;
`;

const StatHighlight = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  gap: 0.5rem;

  .stat-value {
    font-weight: 700;
    color: #9a3412;
  }

  .stat-label {
    color: #4a5568;
    font-size: 0.875rem;
  }
`;

function Energy() {
  const [oilData, setOilData] = useState(null);
  const [oilData2, setOilData2]= useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading2, setLoading2] = useState(true);
  const [error2, setError2] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/plot_3a1.csv');
      if (!response.ok) {
        throw new Error('Failed to load data');
      }
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Raw data:', results.data);
          const processedData = results.data
            .map(row => {
              const date = chrono.parseDate(row.date);
              if (!date) {
                console.warn('Invalid date:', row.date);
                return null;
              }
              return {
                date,
                europe: parseFloat(row.europe) || null,
                middleeast: parseFloat(row.middleeast) || null,
                russia: row.russia === "NA" ? null : parseFloat(row.russia) || null
              };
            })
            .filter(row => row !== null)
            .filter(row => row.europe !== null || row.middleeast !== null || row.russia !== null);
          console.log('Processed data:', processedData);
          if (processedData.length === 0) {
            throw new Error('No valid data found after processing');
          }
          setOilData(processedData);
          setLoading(false);
        },
        error: (error) => {
          throw new Error('Error parsing CSV: ' + error.message);
        }
      });
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  fetchData();
}, []);


useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/plot_3b1.csv');
      if (!response.ok) throw new Error('Failed to load plot_3b1.csv');
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const processed = results.data
            .map(row => {
              const date = chrono.parseDate(row.date);
              if (!date) return null;
              return {
                date,
                asia: parseFloat(row.asia) || null,
                europe: parseFloat(row.europe) || null,
                us: parseFloat(row.us) || null
              };
            })
            .filter(r => r && (r.asia !== null || r.europe !== null || r.us !== null));

          setOilData2(processed);
          setLoading2(false);
        },
        error2: (err) => {
          throw new Error('Parsing error: ' + err.message);
        }
      });
    } catch (err) {
      setError2(err.message);
      setLoading2(false);
    }
  };

  fetchData();
}, []);



  const oilChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 13
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Oil Prices (Daily)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw.y;
            return `${label}: ${value !== null ? value.toFixed(1) : "N/A"}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          tooltipFormat: 'MMM dd, yyyy',
          displayFormats: {
            month: 'MMM yyyy'
          }
        },
        title: {
          display: false
        },
        grid: {
          display: false
        }
      },
      y: {
        min: 0,
        max: 250,
        title: {
          display: true,
          text: 'Price (USD per barrel)',
          font: {
            family: "'Inter', sans-serif"
          }
        },
        grid: {
          borderDash: [5, 5],
          color: 'rgba(226, 232, 240, 0.5)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        radius: 0 
      },
      line: {
        tension: 0.1 
      }
    }
  };

  const oilChartData = {
    datasets: [
      {
        label: "Europe",
        data: oilData ? oilData?.map(row => ({ x: row.date, y: row.europe })) : [],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: "Middle East",
        data: oilData ? oilData?.map(row => ({ x: row.date, y: row.middleeast })) : [],
        borderColor: "rgba(0, 51, 102, 1)",
        backgroundColor: "rgba(0, 51, 102, 0.2)",
        fill: false,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: "Russian Federation",
        data: oilData ? oilData?.map(row => ({ x: row.date, y: row.russia })) : [],
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        fill: false,
        tension: 0.1,
        pointRadius: 0
      }
    ]
  };

  const oilChart2Options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 13
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Oil Prices (Daily) - Asia, Europe, US',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw.y;
            return `${label}: ${value !== null ? value.toFixed(1) : "N/A"}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'year',
          tooltipFormat: 'MMM dd, yyyy',
          displayFormats: {
            year: 'yyyy'
          }
        },
        title: {
          display: false
        },
        grid: {
          display: false
        }
      },
      y: {
        min: 0,
        max: 1250,
        title: {
          display: true,
          text: 'Price (USD per barrel)',
          font: {
            family: "'Inter', sans-serif"
          }
        },
        grid: {
          borderDash: [5, 5],
          color: 'rgba(226, 232, 240, 0.5)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        radius: 0
      },
      line: {
        tension: 0.1
      }
    }
  };

  const oilChart2Data = {
    datasets: [
      {
        label: "Asia",
        data: oilData ? oilData2?.map(row => ({ x: row.date, y: row.asia })) : [],
        borderColor: "rgba(75, 192, 75, 1)",
        backgroundColor: "rgba(75, 192, 75, 0.2)",
        fill: false,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: "Europe",
        data: oilData ? oilData2?.map(row => ({ x: row.date, y: row.europe })) : [],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: "US",
        data: oilData ? oilData2?.map(row => ({ x: row.date, y: row.us })) : [],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: false,
        tension: 0.1,
        pointRadius: 0
      }
    ]
  };



  return (
    <DashboardContainer>
      <Header>
        <EnergyTitle>Energy Dashboard</EnergyTitle>
        <Subtitle>
          Track key energy prices, supply indicators, and market trends across oil, gas, and other commodities.
        </Subtitle>
      </Header>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '1rem 0' }}>
          Error loading data: {error}
        </div>
      )}

      <CardGrid>
        

        <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CardTitle>Global Oil Prices</CardTitle>
          <ChartContainer>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading oil price data...</p>
              </div>
            ) : error ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
                <p>Failed to load data</p>
              </div>
            ) : (
              <Line data={oilChartData} options={oilChartOptions} />
            )}
          </ChartContainer>
          <SourceText>
            Estimated on the basis of Brent (Europe), Dubai (Middle East) and Urals (Russian Federation) benchmark spot prices in USD per barrel.
            <br />
            Source: UN GCRG calculations based on Refinitiv.
          </SourceText>
        </FullWidthCard>
            

        <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CardTitle>Gas Prices (Daily)-Asia, Europe, US</CardTitle>
          <ChartContainer>
            {loading2 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading oil price data...</p>
              </div>
            ) : error2 ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
                <p>Failed to load data</p>
              </div>
            ) : (
              <Line data={oilChart2Data} options={oilChart2Options} />
            )}
          </ChartContainer>
          <SourceText>
            Estimated on the basis of benchmark spot prices in USD per barrel.
            <br />
            Source: UN GCRG calculations based on Refinitiv.
          </SourceText>
        </FullWidthCard>
        <Card
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardTitle>Energy Crisis Indicators</CardTitle>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            Metrics indicating energy supply stress or shortages across global markets.
          </p>
          <StatHighlight>
            <span className="stat-value">+320%</span>
            <span className="stat-label">European gas price increase since 2020</span>
          </StatHighlight>
          <ComingSoonBadge>Enhanced metrics coming soon</ComingSoonBadge>
        </Card>

        <Card
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CardTitle>Renewable Energy Trends</CardTitle>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            Solar and wind capacity growth and investment trends.
          </p>
          <StatHighlight>
            <span className="stat-value">+28%</span>
            <span className="stat-label">Global renewable capacity growth (2022)</span>
          </StatHighlight>
          <ComingSoonBadge>Detailed analysis coming soon</ComingSoonBadge>
        </Card>
        <Card
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <CardTitle>Energy-Food Nexus</CardTitle>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            Relationship between energy prices and agricultural commodity markets.
          </p>
          <StatHighlight>
            <span className="stat-value">0.78</span>
            <span className="stat-label">Correlation coefficient (Oil-Fertilizer)</span>
          </StatHighlight>
          <ComingSoonBadge>Expanded analysis coming soon</ComingSoonBadge>
        </Card>
      </CardGrid>
    </DashboardContainer>
  );
}

export default Energy;