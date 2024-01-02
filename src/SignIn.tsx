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
    <div style={styles.container}>
      <h1 style={styles.header}>Sign In</h1>
      <form onSubmit={handleSignIn} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button style={styles.button} type="submit">Sign In</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  header: {
    color: 'darkblue',
    fontSize: '2rem',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '300px'
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'darkblue',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    color: 'red',
    marginTop: '10px'
  }
};


export default SignIn;