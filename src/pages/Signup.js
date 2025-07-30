import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled Components
const SignupContainer = styled.div`
  max-width: 28rem;
  margin: 2rem auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
`;

const SignupHeader = styled.div`
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

const SignupForm = styled.form`
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
  display: flex;
  justify-content: space-between;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
`;

const SubmitButton = styled(motion.button)`
  background: #10b981;
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
    background: #059669;
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
  color: #10b981;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const PasswordStrength = styled.div`
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const StrengthBar = styled.div`
  height: 100%;
  width: ${props => props.strength}%;
  background: ${props => 
    props.strength < 30 ? '#ef4444' : 
    props.strength < 70 ? '#f59e0b' : '#10b981'};
  transition: all 0.3s ease;
`;

function Signup() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    // Simple password strength calculation
    let strength = 0;
    if (value.length > 0) strength += 20;
    if (value.length >= 8) strength += 30;
    if (/[A-Z]/.test(value)) strength += 15;
    if (/[0-9]/.test(value)) strength += 15;
    if (/[^A-Za-z0-9]/.test(value)) strength += 20;
    setPasswordStrength(Math.min(strength, 100));
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!name || !email || !password) {
        throw new Error('Please fill in all fields');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      setUser({ name, email });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupContainer>
      <SignupHeader>
        <Title>Create an account</Title>
        <Subtitle>Sign up to access the dashboard</Subtitle>
      </SignupHeader>

      <SignupForm onSubmit={submit}>
        {error && (
          <ErrorMessage 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </ErrorMessage>
        )}

        <FormGroup>
          <Label>Full Name</Label>
          <Input 
            type="text" 
            required
            value={name} 
            onChange={e => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </FormGroup>

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
          <Label>
            Password
            <span className="text-xs text-gray-500 ml-2">
              (min 8 characters)
            </span>
          </Label>
          <PasswordWrapper>
            <Input 
              type={showPassword ? "text" : "password"} 
              required
              value={password} 
              onChange={handlePasswordChange}
              placeholder="Create a password"
            />
            <PasswordToggle 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </PasswordToggle>
          </PasswordWrapper>
          <PasswordStrength>
            <StrengthBar strength={passwordStrength} />
          </PasswordStrength>
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </SubmitButton>
      </SignupForm>

      <FooterText>
        Already have an account?{' '}
        <FooterLink to="/login">Sign In</FooterLink>
      </FooterText>
    </SignupContainer>
  );
}

export default Signup;