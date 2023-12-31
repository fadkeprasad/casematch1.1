// src/SignUp.tsx

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email.');
      return;
    }
    if (password.length <= 9) {
      setMessage('Password must be 9 characters long.');
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setMessage('Registration successful! A verification email has been sent. Please verify your email.');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setMessage('You are already registered, please sign-in.');
      } else {
        // You can handle more specific errors if needed
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  const validateEmail = (email: string) => {
    // Simple regex for email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const navigateHome = () => {
    navigate('/');
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'lightblue' }}>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
      {message === 'You are registered! Sign-in now!' && (
        <button onClick={navigateHome}>Go to Home</button>
      )}
    </div>
  );
};

export default SignUp;
