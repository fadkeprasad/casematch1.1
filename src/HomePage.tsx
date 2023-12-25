// src/HomePage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: 'darkblue', fontSize: '48px' }}>Welcome to CaseMatch</h1>
      <button onClick={handleSignUpClick} style={{ fontSize: '20px', margin: '10px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f0f0f0', border: 'none', cursor: 'pointer' }}>Sign Up</button>
      <button onClick={handleSignInClick} style={{ fontSize: '20px', margin: '10px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#f0f0f0', border: 'none', cursor: 'pointer' }}>Sign In</button>
    </div>

  );
};

export default HomePage;
