import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  color: #2d3748;
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
`;

const CrossTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a365d;
  margin-bottom: 1rem;
  line-height: 1.2;
  background: linear-gradient(90deg, #3182ce 0%, #805ad5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #3182ce;
  transition: all 0.2s ease;
  height: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
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

// GDP chart data
const gdpChartData = {
  labels: [
    '01-07-2025', '01-14-2025', '01-21-2025', '01-28-2025',
    '02-04-2025', '02-11-2025', '02-18-2025', '02-25-2025',
    '03-04-2025', '03-11-2025', '03-18-2025', '03-25-2025'
  ],
  datasets: [{
    label: 'GDP',
    data: [
      0.031315666, 0.031315666, 0.031315666, 0.031315666,
      0.032465484, 0.032429159, 0.032429159, 0.032481402,
      0.03339183, 0.033425957, 0.03291994, 0.03291994
    ],
    borderColor: 'rgba(75, 192, 192, 1)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    fill: false,
    tension: 0.1,
    borderWidth: 2
  }]
};

// GDP chart options
const gdpChartOptions = {
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
      text: 'GDP Over Time',
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
      displayColors: true
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'GDP',
        font: {
          family: "'Inter', sans-serif"
        }
      },
      grid: {
        color: 'rgba(226, 232, 240, 0.5)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Date',
        font: {
          family: "'Inter', sans-serif"
        }
      },
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

function CrossCutting() {
  return (
    <DashboardContainer>
      <Header>
        <CrossTitle>Global Crises Socio-Economic Dashboard</CrossTitle>
        <Subtitle>
          Explore indicators that span across multiple sectors, providing a cross-cutting view of global crisis trends.
        </Subtitle>
      </Header>

      <CardGrid>
        <Card
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardTitle>GDP Trends</CardTitle>
          <ChartContainer>
            <Line data={gdpChartData} options={gdpChartOptions} />
          </ChartContainer>
          <SourceText>Source: World Bank, IMF</SourceText>
        </Card>

        <Card
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CardTitle>Global Market Indicators</CardTitle>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            View key global market trends, commodity prices, and financial metrics across regions.
          </p>
          <SourceText>Content coming soon</SourceText>
        </Card>
      </CardGrid>
    </DashboardContainer>
  );
}

export default CrossCutting;