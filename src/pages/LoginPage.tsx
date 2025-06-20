import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import Logo from '../components/Logo';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // kept for input only
  const [domain, setDomain] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !domain) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Password is collected, but NOT used by backend
        body: JSON.stringify({ email, domain }),
      });

      const data = await response.json();
      if (response.ok) {
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      toast.success('Login successful!');
      navigate('/it-helpdesk-view');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Server error. Try again later.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-lt-offWhite flex items-center justify-center">
        <div className="w-80 h-80 bg-lt-lightGrey flex items-center justify-center p-8 rounded-lg shadow-md">
          <Logo />
        </div>
      </div>
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md border border-lt-lightGrey">
            <h2 className="text-[30pt] font-light text-lt-darkBlue mb-8 text-center">LOGIN</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="form-label block mb-2">Email</label>
                <input
                  type="email"
                  className="form-input w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="form-label block mb-2">Password</label>
                <input
                  type="password"
                  className="form-input w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="form-label block mb-2">Domain</label>
                <select
                  className="form-input w-full"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                >
                  <option value="">Select Domain</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Application">Application</option>
                </select>
              </div>
              <div className="flex justify-center">
                <Button type="submit" className="lt-button-primary btn-ripple min-w-[180px] w-full max-w-xs">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
