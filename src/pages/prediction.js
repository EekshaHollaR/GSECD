import React, { useEffect, useState } from 'react';
import { BarChart, PieChart, AreaChart, Bar, Pie, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import * as chrono from 'chrono-node';

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Header = styled.header`
  margin-bottom: 2.5rem;
`;

const PredictionTitle = styled.h1`
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
  height: 400px;
  margin-bottom: 1rem;
`;

const SourceText = styled.p`
  color: #718096;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.thead`
  background-color: #f3f4f6;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  color:black;
  border: 1px solid #e5e7eb;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  color:black;
  border: 1px solid #e5e7eb;
  font-weight: 600;
`;

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

function Prediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/crisis_predictions.csv');
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const cleanedData = results.data.map(row => ({
              date: chrono.parseDate(row.date),
              geography: row.geography,
              countries: row.countries,
              development_status: row.development_status || "Unknown",
              developing_region: row.developing_region || "Unknown",
              crisis_probability: parseFloat(row.crisis_probability) || 0,
              crisis_predicted: parseInt(row.crisis_predicted) || 0,
              crisis_type: row.crisis_type || "None"
            })).filter(row => row.date && !isNaN(row.crisis_probability));
            
            setData(cleanedData);
            setLoading(false);
          },
          error: (err) => {
            throw new Error('Error parsing CSV: ' + err.message);
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

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', fontSize: '1.25rem', color: '#4a5568', marginTop: '2rem' }}>
          Loading crisis predictions...
        </div>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>
          Error: {error}
        </div>
      </DashboardContainer>
    );
  }

  if (!data) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', color: '#4a5568', marginTop: '2rem' }}>
          No data available
        </div>
      </DashboardContainer>
    );
  }

  // Prepare data for visualizations
  // Top countries by crisis probability
  const topCountries = data.reduce((acc, row) => {
    if (!acc[row.geography]) {
      acc[row.geography] = { countries: row.countries, probs: [] };
    }
    acc[row.geography].probs.push(row.crisis_probability);
    return acc;
  }, {});

  const topCountriesData = Object.entries(topCountries)
    .map(([geo, { countries, probs }]) => ({
      geography: geo,
      countries,
      avg_probability: probs.reduce((sum, p) => sum + p, 0) / probs.length
    }))
    .sort((a, b) => b.avg_probability - a.avg_probability)
    .slice(0, 10);

  // Development status distribution
  const devStatusData = data.reduce((acc, row) => {
    acc[row.development_status] = (acc[row.development_status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(devStatusData).map(([name, value]) => ({
    name,
    value
  }));

  // Crisis probability over time for top 5 geographies
  const top5Geos = topCountriesData.slice(0, 5).map(d => d.geography);
  const areaData = top5Geos.map(geo => ({
    geography: geo,
    countries: topCountries[geo].countries,
    data: data
      .filter(row => row.geography === geo)
      .map(row => ({
        date: row.date.toISOString().slice(0, 7),
        probability: row.crisis_probability
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }));

  // Regional summary table
  const regionStats = data.reduce((acc, row) => {
    if (!acc[row.developing_region]) {
      acc[row.developing_region] = { count: 0, total_prob: 0 };
    }
    acc[row.developing_region].count += 1;
    acc[row.developing_region].total_prob += row.crisis_probability;
    return acc;
  }, {});

  const tableData = Object.entries(regionStats)
    .map(([region, { count, total_prob }]) => ({
      region,
      count,
      avg_probability: (total_prob / count).toFixed(3)
    }))
    .filter(row => row.region !== "Unknown")
    .sort((a, b) => b.avg_probability - a.avg_probability);

  return (
    <DashboardContainer>
      <Header>
        <PredictionTitle>Crisis Predictions Report 2025</PredictionTitle>
        <Subtitle>
          Analysis of predicted crisis probabilities across countries and regions for 2025
        </Subtitle>
      </Header>

      <CardGrid>
        {/* Bar Chart: Top 10 Countries by Crisis Probability */}
        <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardTitle>Top 10 Countries by Average Crisis Probability</CardTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topCountriesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="countries" 
                  angle={-45} 
                  textAnchor="end" 
                  interval={0} 
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ 
                    value: "Avg Crisis Probability", 
                    angle: -90, 
                    position: "insideLeft", 
                    fontSize: 12 
                  }} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => [value.toFixed(3), "Average Probability"]} />
                <Legend />
                <Bar 
                  dataKey="avg_probability" 
                  fill="#3B82F6" 
                  name="Average Probability" 
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <SourceText>
            Source: Crisis prediction model data
          </SourceText>
        </FullWidthCard>

        {/* Pie Chart: Development Status Distribution */}
        <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CardTitle>Distribution of Development Status</CardTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                  labelLine={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <SourceText>
            Source: Crisis prediction model data
          </SourceText>
        </FullWidthCard>

        {/* Area Chart: Crisis Probability Over Time */}
        {/* <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CardTitle>Crisis Probability Over Time (Top 5 Countries)</CardTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={areaData[0]?.data || []}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ 
                    value: "Crisis Probability", 
                    angle: -90, 
                    position: "insideLeft", 
                    fontSize: 12 
                  }} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => [value.toFixed(3), "Probability"]} />
                <Legend />
                {areaData.map((geo, index) => (
                  <Area
                    key={geo.geography}
                    data={geo.data}
                    dataKey="probability"
                    name={geo.countries}
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.3}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          <SourceText>
            Source: Crisis prediction model data
          </SourceText>
        </FullWidthCard> */}

        <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <CardTitle>Summary by Developing Region</CardTitle>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Region</TableHeaderCell>
                <TableHeaderCell>Count</TableHeaderCell>
                <TableHeaderCell>Avg Crisis Probability</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.region}</TableCell>
                  <TableCell>{row.count}</TableCell>
                  <TableCell>{row.avg_probability}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          <SourceText>
            Source: Crisis prediction model data
          </SourceText>
        </FullWidthCard>

        {/* Conclusion */}
        <FullWidthCard
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <CardTitle>Conclusion</CardTitle>
          <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
            The analysis reveals that Switzerland is the only country with a predicted crisis in 2025, though the crisis type is unspecified. Developing countries like Benin, Ecuador, Qatar, and the United Arab Emirates show elevated crisis probabilities, particularly in Africa and Asia and Oceania, suggesting potential vulnerabilities in these regions. The static nature of probabilities over time indicates consistent risk factors. Policymakers should monitor these high-risk areas, especially Switzerland, for early intervention.
          </p>
        </FullWidthCard>
      </CardGrid>
    </DashboardContainer>
  );
}

export default Prediction;