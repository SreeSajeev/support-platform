import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    try {
      const response = await fetch('https://sg9w2ksj-5000.inc1.devtunnels.ms/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(errorText || 'Login failed. Check your credentials.');
        return;
      }

      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData)); // Persist user

      // Redirect after login
      navigate('/index');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Something went wrong. Please try again later.');
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

            <div className="login-field">
              <label className="form-label block mb-1">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center mb-4">
              <label className="flex items-center text-sm text-lt-grey">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2"
                />
                Remember me
              </label>
              <span className="text-sm text-lt-grey">Forgot Password?</span>
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
