// src/SignIn.tsx

import React, { useState } from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from 'firebase/auth';


const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(''); // Clear any previous errors

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => navigate('/userprofile'), 1000);
      navigate('/UserProfile'); // Redirect to the user profile page on successful sign-in
    } catch (error) {
      // Here you can handle different types of errors differently if needed
      setError('Credentials don\'t match.'); // Set error message on unsuccessful sign-in
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'lightblue' }}>Sign In</h1>
      <form onSubmit={handleSignIn}>
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
        <button type="submit">Sign In</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default SignIn;
