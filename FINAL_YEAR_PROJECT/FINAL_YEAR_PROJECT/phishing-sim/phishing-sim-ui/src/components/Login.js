import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For storing error messages

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if username and password are correct
    if (username === 'admin' && password === 'admin') {
      // Redirect to the dashboard page after successful login
      window.location.href = '/dashboard';
    } else {
      setError('Invalid username or password');
    }
  };

  // Inline styles object
  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
    },
    loginContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: `url('https://wallpaperaccess.com/full/1900932.jpg') no-repeat center center fixed`,
      backgroundSize: 'cover',
    },
    loginBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for the login box
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      padding: '30px',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    h2: {
      color: '#333',
      marginBottom: '20px',
      fontSize: '24px',
    },
    inputContainer: {
      marginBottom: '20px',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      color: '#333',
      marginBottom: '5px',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '14px',
      color: '#333',
    },
    inputFocus: {
      borderColor: '#007bff',
      outline: 'none',
    },
    loginButton: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    loginButtonHover: {
      backgroundColor: '#0056b3',
    },
    errorMessage: {
      color: 'red',
      marginBottom: '15px',
      fontSize: '14px',
    }
  };

  return (
    <>
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h2 style={styles.h2}>Sign In</h2>
          {error && <div style={styles.errorMessage}>{error}</div>} {/* Display error message */}
          <form onSubmit={handleSubmit}>
            <div style={styles.inputContainer}>
              <label htmlFor="username" style={styles.label}>Username</label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter your username" 
                required 
                style={styles.input}
              />
            </div>
            <div style={styles.inputContainer}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                required 
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.loginButton}>Sign In</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
