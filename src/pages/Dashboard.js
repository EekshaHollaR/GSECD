import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Header = styled.header`
  margin-bottom: 3rem;
  text-align: center;
`;

const Title = styled.h1`
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
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const CategoryCard = styled(motion(Link))`
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border-top: 4px solid ${props => props.$color};
  transition: all 0.2s ease;
  text-decoration: none;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
`;

const CardDescription = styled.p`
  color: #4a5568;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 1.5rem;
`;

const ViewButton = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.$color};
  background-color: ${props => `${props.$color}10`};
  transition: all 0.2s ease;
  width: fit-content;

  ${CategoryCard}:hover & {
    background-color: ${props => `${props.$color}20`};
  }
`;

// Color mapping
const colorMap = {
  "border-dashboard-blue": "#3182ce",
  "border-dashboard-amber": "#d69e2e",
  "border-dashboard-orange": "#dd6b20",
  "border-dashboard-green": "#38a169"
};

function Dashboard() {
  const categories = [
    {
      title: "Cross-Cutting",
      description: "Metrics spanning multiple sectors and contexts",
      color: "border-dashboard-blue",
      path: "/cross-cutting",
    },
    {
      title: "Food & Nutrition",
      description: "Food security and agricultural indicators",
      color: "border-dashboard-amber",
      path: "/food",
    },
    {
      title: "Energy",
      description: "Energy availability and pricing metrics",
      color: "border-dashboard-orange",
      path: "/energy",
    },
    {
      title: "Finance",
      description: "Financial stability and market indicators",
      color: "border-dashboard-green",
      path: "/finance",
    },
    {
      title:"Prediction",
      description: "Predicted Crisis Statistic obtained from different Socio-Economic parameters",
      color:"border-dashboard-blue",
      path:"/prediction",
    },
  ];

  return (
    <DashboardContainer>
      <Header>
        <Title>Global Crises Socio-Economic Dashboard</Title>
        <Subtitle>
          Access comprehensive data and analysis on global socio-economic indicators across multiple domains.
        </Subtitle>
      </Header>

      <CategoryGrid>
        {categories.map((cat, index) => (
          <CategoryCard
            key={cat.title}
            to={cat.path}
            $color={colorMap[cat.color]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CardTitle>{cat.title}</CardTitle>
            <CardDescription>{cat.description}</CardDescription>
            <ViewButton $color={colorMap[cat.color]}>
              View Details
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={colorMap[cat.color]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ViewButton>
          </CategoryCard>
        ))}
      </CategoryGrid>
    </DashboardContainer>
  );
}

export default Dashboard;