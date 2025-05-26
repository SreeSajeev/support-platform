
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import Logo from '../components/Logo';

const LoginPage: React.FC = () => {
  const [userGroup, setUserGroup] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userGroup) {
      toast.error('Please select a user group');
      return;
    }

    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    
    // Redirect based on user group
    if (userGroup === 'IT') {
      navigate('/it-helpdesk-view');
    } else {
      navigate('/');
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
                <label className="form-label block mb-2">User Group</label>
                <div className="relative">
                  <button
                    type="button"
                    className="form-input flex justify-between items-center w-full cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>{userGroup || 'Select User Group'}</span>
                    <ChevronDown className="h-5 w-5 text-lt-grey" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-lt-lightGrey rounded-md shadow-lg">
                      <ul>
                        <li
                          className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                          onClick={() => {
                            setUserGroup('IT');
                            setIsDropdownOpen(false);
                          }}
                        >
                          IT
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                          onClick={() => {
                            setUserGroup('Others');
                            setIsDropdownOpen(false);
                          }}
                        >
                          Others
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="form-label block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className={`form-input ${emailError ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  className="lt-button-primary btn-ripple min-w-[180px] w-full max-w-xs"
                >
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
