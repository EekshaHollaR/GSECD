import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled Components
const ProfileContainer = styled.div`
  max-width: 28rem;
  margin: 2rem auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
`;

const ProfileHeader = styled.div`
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

const ProfileForm = styled.div`
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
  background: #f8fafc;
  color: #64748b;
  cursor: not-allowed;
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
`;

const AvatarText = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const ComingSoonButton = styled(motion.button)`
  background: #e2e8f0;
  color: #64748b;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: not-allowed;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const SignInPrompt = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #64748b;
`;

const SignInLink = styled.a`
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
  }
`;

function Profile() {
  const { user } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);

  if (!user) {
    return (
      <SignInPrompt>
        Please <SignInLink href="/login">sign in</SignInLink> to view your profile.
      </SignInPrompt>
    );
  }

  // Get initials for avatar
  const initials = user.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Title>Account Information</Title>
        <Subtitle>View and manage your account details</Subtitle>
      </ProfileHeader>

      <AvatarContainer>
        <Avatar>{initials}</Avatar>
        <AvatarText>Profile picture coming soon</AvatarText>
      </AvatarContainer>

      <ProfileForm>
        <FormGroup>
          <Label>Name</Label>
          <Input 
            type="text" 
            value={user.name} 
            disabled={!editMode}
            placeholder="Your full name"
          />
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <Input 
            type="email" 
            value={user.email} 
            disabled={!editMode}
            placeholder="Your email address"
          />
        </FormGroup>

        <ComingSoonButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Profile editing coming soon
        </ComingSoonButton>
      </ProfileForm>
    </ProfileContainer>
  );
}

export default Profile;