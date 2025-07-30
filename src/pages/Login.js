import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled Components
const LoginContainer = styled.div`
  max-width: 28rem;
  margin: 2rem auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
`;

const LoginHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const FooterText = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 1.5rem;
  text-align: center;
`;

const FooterLink = styled(Link)`
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
  }
`;

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, validate credentials against your backend
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      setUser({ name: 'User', email });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginHeader>
        <Title>Welcome back</Title>
        <Subtitle>Sign in to access your dashboard</Subtitle>
      </LoginHeader>

      <LoginForm onSubmit={submit}>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mb-2"
          >
            {error}
          </motion.div>
        )}

        <FormGroup>
          <Label>Email</Label>
          <Input 
            type="email" 
            required
            value={email} 
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormGroup>

        <FormGroup>
          <Label>Password</Label>
          <Input 
            type="password" 
            required
            value={password} 
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </SubmitButton>
      </LoginForm>

      <FooterText>
        Don't have an account?{' '}
        <FooterLink to="/signup">Create an account</FooterLink>
      </FooterText>
    </LoginContainer>
  );
}

export default Login;