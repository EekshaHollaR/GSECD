import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled Components
const NavContainer = styled.nav`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const NavBrand = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  text-decoration: none;
  background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavItem = styled(NavLink)`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
  transition: all 0.2s ease;

  &:hover {
    color: #334155;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #3b82f6;
    transition: width 0.3s ease;
  }

  &.active {
    color: #1e293b;
    font-weight: 600;

    &::after {
      width: 100%;
    }
  }
`;

const AuthItems = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const AuthButton = styled(motion.button)`
  font-size: 0.875rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: all 0.2s ease;
`;

const LoginButton = styled(AuthButton)`
  color: #64748b;

  &:hover {
    color: #334155;
  }
`;

const SignUpButton = styled(AuthButton)`
  color: white;
  background: #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 6px;

  &:hover {
    background: #2563eb;
  }
`;

const LogoutButton = styled(AuthButton)`
  color: #ef4444;

  &:hover {
    color: #dc2626;
    text-decoration: underline;
  }
`;

const ProfileLink = styled(NavLink)`
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: #334155;
  }

  &.active {
    color: #1e293b;
    font-weight: 600;
  }
`;

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <NavContainer>
      <NavBrand to="/">Global Crisis Insights</NavBrand>
      
      <NavItems>
        <NavItem to="/">Home</NavItem>
        <NavItem to="/cross-cutting">Cross-Cutting</NavItem>
        <NavItem to="/food">Food & Nutrition</NavItem>
        <NavItem to="/energy">Energy</NavItem>
        <NavItem to="/finance">Finance</NavItem>
        <NavItem to="/prediction">Prediction</NavItem>
      </NavItems>

      <AuthItems>
        {user ? (
          <>
            <ProfileLink to="/profile">Profile</ProfileLink>
            <LogoutButton
              onClick={logout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Out
            </LogoutButton>
          </>
        ) : (
          <>
            <LoginButton
              as={NavLink}
              to="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </LoginButton>
            <SignUpButton
              as={NavLink}
              to="/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </SignUpButton>
          </>
        )}
      </AuthItems>
    </NavContainer>
  );
}

export default Navbar;