import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Papa from 'papaparse';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
`;

const FinTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #065f46;
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
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border-top: 4px solid #059669;
  transition: all 0.2s ease;
  height: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const FullWidthCard = styled(Card)`
  grid-column: 1 / -1;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 1rem;
`;

const SourceText = styled.p`
  color: #718096;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const ComingSoonBadge = styled.span`
  display: inline-block;
  background: #ecfdf5;
  color: #059669;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 1rem;
`;

const ChartRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ChartWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

function Finance() {
  const [inflationData, setInflationData] = useState(null);
  const [exchangeData, setExchangeData] = useState(null);
  const [exchangeRateIndexData, setExchangeRateIndexData] = useState(null);
  const [reservesData, setReservesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingExchangeRate, setLoadingExchangeRate] = useState(true);
  const [loadingReserves, setLoadingReserves] = useState(true);

  useEffect(() => {
    // Simulated data for inflation and exchange rates
    const timer = setTimeout(() => {
      const years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
      const usInflation = [2.07, 1.46, 1.62, 0.12, 1.26, 2.07, 1.91, 1.81, 1.25, 4.02, 8.0];
      const euInflation = [2.5, 1.3, 0.4, 0.0, 0.2, 1.5, 1.8, 1.4, 0.3, 2.9, 8.1];
      setInflationData({ years, usInflation, euInflation });

      const currencies = ['EUR', 'JPY', 'INR', 'GBP', 'CNY'];
      const rates = [0.85, 130.0, 75.0, 0.72, 6.75];
      const changes = [1.2, -5.3, 2.1, 0.8, -1.5];
      setExchangeData({ currencies, rates, changes });

      setLoading(false);
    }, 1200);

    // Load exchange rate index data from CSV
    const loadExchangeRateData = async () => {
      try {
        const response = await fetch('/plot_4a1.csv');
        if (!response.ok) {
          throw new Error('Failed to load exchange rate data');
        }
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedData = results.data.map(row => ({
              date: row.date,
              africa: parseFloat(row.africa) || null,
              asiaoceania: parseFloat(row.asiaoceania) || null,
              america: parseFloat(row.america) || null
            })).filter(row => row.date && (row.africa !== null || row.asiaoceania !== null || row.america !== null));
            
            setExchangeRateIndexData(processedData);
            setLoadingExchangeRate(false);
          },
          error: (err) => {
            throw new Error('Error parsing CSV: ' + err.message);
          }
        });
      } catch (err) {
        console.error('Error loading exchange rate data:', err);
        setLoadingExchangeRate(false);
      }
    };

    // Load international reserves data from CSV
    const loadReservesData = async () => {
      try {
        const response = await fetch('/plot_4b2.csv');
        if (!response.ok) {
          throw new Error('Failed to load reserves data');
        }
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedData = results.data.map(row => ({
              date: row.date,
              developed: row.developed_4b2 === "NA" ? null : parseFloat(row.developed_4b2),
              developing: row.developing_4b2 === "NA" ? null : parseFloat(row.developing_4b2),
              africa: row.africa_4b2 === "NA" ? null : parseFloat(row.africa_4b2),
              asiaoceania: row.asiaoceania_4b2 === "NA" ? null : parseFloat(row.asiaoceania_4b2),
              america: row.america_4b2 === "NA" ? null : parseFloat(row.america_4b2)
            })).filter(row => row.date);
            
            setReservesData(processedData);
            setLoadingReserves(false);
          },
          error: (err) => {
            throw new Error('Error parsing CSV: ' + err.message);
          }
        });
      } catch (err) {
        console.error('Error loading reserves data:', err);
        setLoadingReserves(false);
      }
    };

    loadExchangeRateData();
    loadReservesData();

    return () => clearTimeout(timer);
  }, []);

  // Inflation chart options
  const inflationChartOptions = {
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
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Inflation Rate (%)',
          font: {
            family: "'Inter', sans-serif"
          }
        },
        grid: {
          color: 'rgba(226, 232, 240, 0.5)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#FFFFFF',
        borderWidth: 2
      }
    }
  };

  // Exchange rate chart options
  const exchangeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const index = context.dataIndex;
            const change = exchangeData?.changes[index];
            return `Change: ${change > 0 ? '+' : ''}${change}% (YoY)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'USD to 1 Unit',
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    }
  };

  // Exchange rate index chart options
  const exchangeRateIndexOptions = {
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
        text: 'Exchange Rate Index Against the US Dollar (Jan 1/2019 = 100)',
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
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        min: 80,
        max: 102,
        title: {
          display: true,
          text: 'Index (Jan 1/2019 = 100)',
          font: {
            family: "'Inter', sans-serif"
          }
        },
        ticks: { 
          stepSize: 1
        }
      },
      x: {
        ticks: {
          maxTicksLimit: 20
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6
      },
      line: {
        tension: 0.1
      }
    }
  };

  // International reserves chart options
  const reservesChartOptions = {
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
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        min: 0,
        max: 9,
        title: {
          display: true,
          text: 'Months of Imports',
          font: {
            family: "'Inter', sans-serif"
          }
        },
        ticks: { 
          stepSize: 1
        }
      },
      x: {
        ticks: {
          maxTicksLimit: 10
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6
      },
      line: {
        tension: 0.1
      }
    }
  };

  // Inflation chart data
  const inflationChartData = {
    labels: inflationData ? inflationData.years : [],
    datasets: [
      {
        label: 'United States',
        data: inflationData ? inflationData.usInflation : [],
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
      {
        label: 'European Union',
        data: inflationData ? inflationData.euInflation : [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }
    ]
  };

  // Exchange rate chart data
  const exchangeChartData = {
    labels: exchangeData ? exchangeData.currencies : [],
    datasets: [
      {
        label: 'Exchange Rate',
        data: exchangeData ? exchangeData.rates : [],
        backgroundColor: [
          '#3B82F6',
          '#F97316',
          '#10B981',
          '#F59E0B',
          '#EF4444'
        ],
        borderColor: '#fff',
        borderWidth: 1,
        hoverBackgroundColor: [
          '#2563EB',
          '#EA580C',
          '#059669',
          '#D97706',
          '#DC2626'
        ]
      }
    ]
  };

  // Exchange rate index chart data
  const exchangeRateIndexDataChart = {
    labels: exchangeRateIndexData ? exchangeRateIndexData.map(row => row.date) : [],
    datasets: [
      {
        label: 'Africa',
        data: exchangeRateIndexData ? exchangeRateIndexData.map(row => row.africa) : [],
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Asia and Oceania',
        data: exchangeRateIndexData ? exchangeRateIndexData.map(row => row.asiaoceania) : [],
        borderColor: '#1E90FF',
        backgroundColor: 'rgba(30, 144, 255, 0.1)',
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Latin America and the Caribbean',
        data: exchangeRateIndexData ? exchangeRateIndexData.map(row => row.america) : [],
        borderColor: '#228B22',
        backgroundColor: 'rgba(34, 139, 34, 0.1)',
        borderWidth: 2,
        fill: false
      }
    ]
  };

  // International reserves chart data
  const reservesChartData = (region) => {
    return {
      labels: reservesData ? reservesData.map(row => row.date) : [],
      datasets: [
        {
          label: 'Developed Countries',
          data: reservesData ? reservesData.map(row => row.developed) : [],
          borderColor: '#999',
          borderDash: [5, 5],
          backgroundColor: 'rgba(153, 153, 153, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1
        },
        {
          label: 'Developing Countries',
          data: reservesData ? reservesData.map(row => row.developing) : [],
          borderColor: '#1E90FF',
          backgroundColor: 'rgba(30, 144, 255, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1
        },
        {
          label: region === 'africa' ? 'Africa' : 
                region === 'asiaoceania' ? 'Asia and Oceania' : 
                'Latin America and the Caribbean',
          data: reservesData ? reservesData.map(row => row[region]) : [],
          borderColor: '#FFD700',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1
        }
      ]
    };
  };

  return (
    <DashboardContainer>
      <Header>
        <FinTitle>Finance Dashboard</FinTitle>
        <Subtitle>
          Analyze financial indicators of the global crisis: inflation, exchange rates, debt, and monetary policies.
        </Subtitle>
      </Header>

      <CardGrid>
        <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <CardTitle>Evolution of International Reserves in Months of Imports</CardTitle>
          <CardTitle style={{ fontSize: '1rem', fontWeight: 'normal', marginTop: '-1rem', marginBottom: '1rem' }}>
            Median by Group and Region
          </CardTitle>
          
          {loadingReserves ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>Loading reserves data...</p>
            </div>
          ) : (
            <ChartRow>
              <ChartWrapper>
                <h3>Africa</h3>
                <ChartContainer>
                  <Line data={reservesChartData('africa')} options={reservesChartOptions} />
                </ChartContainer>
              </ChartWrapper>
              <ChartWrapper>
                <h3>Asia and Oceania</h3>
                <ChartContainer>
                  <Line data={reservesChartData('asiaoceania')} options={reservesChartOptions} />
                </ChartContainer>
              </ChartWrapper>
              <ChartWrapper>
                <h3>Latin America and the Caribbean</h3>
                <ChartContainer>
                  <Line data={reservesChartData('america')} options={reservesChartOptions} />
                </ChartContainer>
              </ChartWrapper>
            </ChartRow>
          )}
          <SourceText>Source: UN GCRG calculations</SourceText>
        </FullWidthCard>
        <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CardTitle>Exchange Rate Index Against the US Dollar</CardTitle>
          <ChartContainer>
            {loadingExchangeRate ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading exchange rate index data...</p>
              </div>
            ) : (
              <Line data={exchangeRateIndexDataChart} options={exchangeRateIndexOptions} />
            )}
          </ChartContainer>
          <SourceText>Index (Jan 1/2019 = 100) | Source: UN GCRG calculations</SourceText>
        </FullWidthCard>
        <Card
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardTitle>Global Inflation Rates</CardTitle>
          <ChartContainer>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading inflation data...</p>
              </div>
            ) : (
              <Line data={inflationChartData} options={inflationChartOptions} />
            )}
          </ChartContainer>
          <SourceText>Source: World Bank, OECD, IMF</SourceText>
        </Card>

        <Card
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CardTitle>Currency Exchange Rates</CardTitle>
          <ChartContainer>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading exchange rate data...</p>
              </div>
            ) : (
              <Bar data={exchangeChartData} options={exchangeChartOptions} />
            )}
          </ChartContainer>
          <SourceText>Source: Federal Reserve, European Central Bank</SourceText>
        </Card>

        <Card
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <CardTitle>Global Debt Indicators</CardTitle>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            Monitor government and corporate debt levels across major economies.
          </p>
          <ComingSoonBadge>Enhanced metrics coming soon</ComingSoonBadge>
        </Card>

        <Card
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <CardTitle>Central Bank Policies</CardTitle>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            Track interest rate decisions and quantitative easing programs.
          </p>
          <ComingSoonBadge>Policy tracker coming soon</ComingSoonBadge>
        </Card>
      </CardGrid>
    </DashboardContainer>
  );
}

export default Finance;