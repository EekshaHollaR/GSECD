import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Papa from 'papaparse';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
`;

const FoodTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #b45309;
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
  border-top: 4px solid #d97706;
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

const HalfWidthCard = styled(Card)`
  grid-column: span 1;
  @media (min-width: 768px) {
    grid-column: span 2;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const CardContent = styled.div`
  color: #4a5568;
  line-height: 1.6;
`;

const LoadingText = styled.p`
  color: #718096;
  text-align: center;
  padding: 2rem 0;
`;

const ChartFooter = styled.p`
  color: #718096;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SmallChartWrapper = styled.div`
  width: 100%;
  @media (min-width: 768px) {
    width: calc(33% - 1rem);
  }
  height: 300px;
`;

async function loadCSVData(filePath) {
  const response = await fetch(filePath);
  const text = await response.text();
  return new Promise((resolve) => {
    Papa.parse(text, {
      header: true,
      complete: (results) => resolve(results.data)
    });
  });
}

function processAgriData(rawData) {
  const monthlyData = {};

  rawData.forEach(row => {
    if (!row.date || !row.index) return;
    const parsedDate = new Date(row.date);
    const monthKey = `${parsedDate.getFullYear()}-${parsedDate.getMonth() + 1}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { dates: [], index: [], corn: [], rice: [], wheat: [] };
    }

    monthlyData[monthKey].dates.push(parsedDate);
    monthlyData[monthKey].index.push(parseFloat(row.index));
    monthlyData[monthKey].corn.push(parseFloat(row.corn));
    monthlyData[monthKey].rice.push(parseFloat(row.rice));
    monthlyData[monthKey].wheat.push(parseFloat(row.wheat));
  });

  const dates = [];
  const indexValues = [];
  const cornValues = [];
  const riceValues = [];
  const wheatValues = [];

  for (const monthKey in monthlyData) {
    const data = monthlyData[monthKey];
    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    dates.push(data.dates[0]);
    indexValues.push(avg(data.index));
    cornValues.push(avg(data.corn));
    riceValues.push(avg(data.rice));
    wheatValues.push(avg(data.wheat));
  }

  return { dates, index: indexValues, corn: cornValues, rice: riceValues, wheat: wheatValues };
}

function processInflationData(rawData) {
  const dates = [];
  const developingCountries = [];
  const africa = [];
  const asiaoceania = [];
  const america = [];

  rawData.forEach(row => {
    if (!row.date) return;
    const parsedDate = new Date(row.date);
    
    dates.push(parsedDate);
    developingCountries.push(row.developing === 'NA' ? null : parseFloat(row.developing) * 100);
    africa.push(row.africa === 'NA' ? null : parseFloat(row.africa) * 100);
    asiaoceania.push(row.asiaoceania === 'NA' ? null : parseFloat(row.asiaoceania) * 100);
    america.push(row.america === 'NA' ? null : parseFloat(row.america) * 100);
  });

  return { dates, developingCountries, africa, asiaoceania, america };
}

function processFoodPriceIndexData(rawData) {
  const dates = [];
  const values = [];

  rawData.forEach(row => {
    if (!row.date || !row.value) return;
    dates.push(new Date(row.date));
    values.push(parseFloat(row.value));
  });

  return { dates, values };
}

function Food() {
  const [foodData, setFoodData] = useState(null);
  const [agriData, setAgriData] = useState(null);
  const [inflationData, setInflationData] = useState(null);
  const [foodPriceIndexData, setFoodPriceIndexData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load food price data
        const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
        const values = [100, 98, 105, 110, 115, 120, 118, 122, 130, 125];
        const production = [85, 88, 92, 95, 97, 99, 96, 94, 90, 93];
        setFoodData({ years, values, production });


        // Load agricultural data
        const rawAgriData = await loadCSVData('/commodity Food price.csv');
        const processedAgriData = processAgriData(rawAgriData);
        setAgriData(processedAgriData);

        // Load inflation data
        const rawInflationData = await loadCSVData('/food price inflation.csv');
        const processedInflationData = processInflationData(rawInflationData);
        setInflationData(processedInflationData);

        // Load food price index data
        const rawFoodPriceIndexData = await loadCSVData('/food pricee index.csv');
        const processedFoodPriceIndexData = processFoodPriceIndexData(rawFoodPriceIndexData);
        setFoodPriceIndexData(processedFoodPriceIndexData);

        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, []);

  // Chart options configurations (previous options remain the same)
  // ... [Previous chart options configurations]

  const chartOptions = {
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
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(226, 232, 240, 0.5)'
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
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

  // Agricultural chart options
  const agriChartOptions = {
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
      },
      title: {
        display: true,
        text: 'Agricultural and Livestock Index Trends (2019-2025)',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'year',
          displayFormats: {
            year: 'yyyy'
          }
        },
        title: {
          display: true,
          text: 'Year'
        },
        min: '2019-01-01',
        max: '2025-04-01',
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        min: 75,
        max: 250,
        title: {
          display: true,
          text: 'Index Value'
        },
        grid: {
          color: 'rgba(226, 232, 240, 0.5)'
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
        backgroundColor: '#FFFFFF',
        borderWidth: 2
      },
      line: {
        tension: 0.1
      }
    }
  };

  // Chart data with multiple datasets
  const chartData = {
    labels: foodData ? foodData.years : [],
    datasets: [
      {
        label: 'Food Price Index',
        data: foodData ? foodData.values : [],
        borderColor: '#D97706',
        backgroundColor: 'rgba(217, 119, 6, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
      {
        label: 'Food Production Index',
        data: foodData ? foodData.production : [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        hidden: true
      }
    ]
  };

  // Agricultural chart data
  const agriChartData = {
    labels: agriData ? agriData.dates : [],
    datasets: [
      {
        label: 'Agricultural and Livestock Index',
        data: agriData ? agriData.index : [],
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Corn',
        data: agriData ? agriData.corn : [],
        borderColor: 'rgba(255, 215, 0, 1)',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Rice',
        data: agriData ? agriData.rice : [],
        borderColor: 'rgba(0, 0, 255, 1)',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Wheat',
        data: agriData ? agriData.wheat : [],
        borderColor: 'rgba(169, 169, 169, 1)',
        backgroundColor: 'rgba(169, 169, 169, 0.2)',
        borderWidth: 2,
        fill: false
      }
    ]
  };
  // New chart options for inflation charts
  const inflationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${value.toFixed(2)}%`;
          },
          title: function(context) {
            const date = new Date(context[0].parsed.x);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            return `${month} ${year}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'year',
          displayFormats: {
            year: 'yyyy'
          }
        },
        min: '2019-01-01',
        max: '2025-03-01',
        grid: {
          display: false
        },
        ticks: {
          callback: function(value) {
            const date = new Date(value);
            const month = date.getMonth();
            const year = date.getFullYear();
            if (month === 0) return `Jan ${year}`;
            if (month === 1 && year === 2025) return `Feb ${year}`;
            return '';
          },
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        min: 0,
        max: 15,
        ticks: {
          callback: (value) => `${value}%`,
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 5,
        hoverBackgroundColor: 'rgba(0, 0, 0, 1)',
        hoverBorderColor: 'rgba(255, 255, 255, 1)',
        hoverBorderWidth: 2
      },
      line: {
        tension: 0.1
      }
    }
  };

  // Food Price Index chart options
  const foodPriceIndexOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'FAO Food Price Index',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      subtitle: {
        display: true,
        text: 'FAO Food Price Index (Jan 2019 = 100)',
        font: {
          size: 12
        },
        padding: {
          bottom: 10
        }
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `Index: ${value.toFixed(2)}`;
          },
          title: function(context) {
            const date = new Date(context[0].parsed.x);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            return `${month} ${year}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'year',
          displayFormats: {
            year: 'yyyy'
          }
        },
        min: '2019-01-01',
        max: '2025-03-01',
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        min: 90,
        max: 180,
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 5,
        hoverBackgroundColor: 'rgba(0, 0, 255, 1)',
        hoverBorderColor: 'rgba(255, 255, 255, 1)',
        hoverBorderWidth: 2
      },
      line: {
        tension: 0.1
      }
    }
  };

  const createInflationChartData = (regionData, regionLabel, regionColor) => ({
    labels: inflationData ? inflationData.dates : [],
    datasets: [
      {
        label: 'Developing Countries',
        data: inflationData ? inflationData.developingCountries : [],
        borderColor: 'rgba(0, 0, 0, 1)',
        borderDash: [5, 5],
        borderWidth: 2,
        fill: false
      },
      {
        label: regionLabel,
        data: regionData,
        borderColor: regionColor,
        backgroundColor: regionColor.replace('1)', '0.2)'),
        borderWidth: 2,
        fill: true
      }
    ]
  });

  // Food Price Index chart data
  const foodPriceIndexChartData = {
    labels: foodPriceIndexData ? foodPriceIndexData.dates : [],
    datasets: [
      {
        label: 'FAO Food Price Index',
        data: foodPriceIndexData ? foodPriceIndexData.values : [],
        borderColor: 'rgba(0, 0, 255, 1)',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        borderWidth: 2,
        fill: false
      }
    ]
  };

  if (error) {
    return (
      <DashboardContainer>
        <Header>
          <FoodTitle>Food & Nutrition Dashboard</FoodTitle>
          <Subtitle>Error loading data</Subtitle>
        </Header>
        <Card>
          <CardContent>
            <p style={{ color: 'red' }}>{error}</p>
          </CardContent>
        </Card>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <FoodTitle>Food & Nutrition Dashboard</FoodTitle>
        <Subtitle>
          Track global food commodity prices, production trends, and nutrition indicators.
        </Subtitle>
      </Header>

      <CardGrid>

        <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <CardTitle>Commodity Price Trends</CardTitle>
          <div style={{ height: '400px', marginTop: '1.5rem' }}>
            {loading ? (
              <LoadingText>Loading agricultural data...</LoadingText>
            ) : (
              <Line data={agriChartData} options={agriChartOptions} />
            )}
          </div>
          <ChartFooter>
            Monthly averages of agricultural commodity indices (2019-2025) | Source: Agricultural Data
          </ChartFooter>
        </FullWidthCard>

        <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <CardTitle>Food Price Inflation by Region</CardTitle>
          <CardContent>
            Year-on-year food inflation rate in developing countries, median by group and region
          </CardContent>
          <ChartContainer>
            {loading ? (
              <LoadingText>Loading inflation data...</LoadingText>
            ) : (
              <>
                <SmallChartWrapper>
                  <Line 
                    data={createInflationChartData(inflationData?.africa, 'Africa', 'rgba(255, 215, 0, 1)')} 
                    options={inflationChartOptions} 
                  />
                  <h3 style={{ textAlign: 'center', marginTop: '0.5rem' }}>Africa</h3>
                </SmallChartWrapper>
                <SmallChartWrapper>
                  <Line 
                    data={createInflationChartData(inflationData?.asiaoceania, 'Asia and Oceania', 'rgba(0, 0, 255, 1)')} 
                    options={inflationChartOptions} 
                  />
                  <h3 style={{ textAlign: 'center', marginTop: '0.5rem' }}>Asia and Oceania</h3>
                </SmallChartWrapper>
                <SmallChartWrapper>
                  <Line 
                    data={createInflationChartData(inflationData?.america, 'Latin America and the Caribbean', 'rgba(0, 0, 139, 1)')} 
                    options={inflationChartOptions} 
                  />
                  <h3 style={{ textAlign: 'center', marginTop: '0.5rem' }}>Latin America and the Caribbean</h3>
                </SmallChartWrapper>
              </>
            )}
          </ChartContainer>
          <ChartFooter>
            Source: World Bank Food Security Update
          </ChartFooter>
        </FullWidthCard>

        <HalfWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <CardTitle>FAO Food Price Index</CardTitle>
          <div style={{ height: '300px', marginTop: '1.5rem' }}>
            {loading ? (
              <LoadingText>Loading food price index data...</LoadingText>
            ) : (
              <Line data={foodPriceIndexChartData} options={foodPriceIndexOptions} />
            )}
          </div>
          <ChartFooter>
            FAO Food Price Index (Jan 2019 = 100) | Source: Food and Agriculture Organization
          </ChartFooter>
        </HalfWidthCard>

        <Card
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CardTitle>Food Security Indicators</CardTitle>
          <CardContent>
            {loading ? (
              <LoadingText>Loading security data...</LoadingText>
            ) : (
              <>
                <p>Monitor undernourishment prevalence and food supply adequacy.</p>
                <div className="mt-4 flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-sm">828M people affected globally</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

    
        <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CardTitle>Global Food Indices</CardTitle>
          <div style={{ height: '400px', marginTop: '1.5rem' }}>
            {loading ? (
              <LoadingText>Loading chart data...</LoadingText>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
          <ChartFooter>
            FAO Food Price Index (2014-16=100) | Source: Food and Agriculture Organization of the United Nations
          </ChartFooter>
        </FullWidthCard>
      </CardGrid>
    </DashboardContainer>
  );
}

export default Food;