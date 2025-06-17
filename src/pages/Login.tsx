import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const userData = await response.json();

      if (!response.ok) {
        setErrorMessage(userData.error || 'Login failed.');
        return;
      }

      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/index');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="w-80 h-80 bg-lt-lightGrey flex items-center justify-center">
          <Logo />
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2 className="login-title">LOGIN</h2>

          <form onSubmit={handleLogin}>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {errorMessage}
              </div>
            )}

            <div className="login-field">
              <label className="form-label block mb-1">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <button type="submit" className="login-button">
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;