import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import Logo from '../components/Logo';

interface User {
  name: string;
  email: string;
  ps: string;
}

const mockUsers: Record<string, User[]> = {
  IT: [
    { name: 'Alice Johnson', email: 'alice.johnson@example.com', ps: 'PS1001' },
    { name: 'Bob Smith', email: 'bob.smith@example.com', ps: 'PS1002' },
  ],
  Others: [
    { name: 'Charlie Williams', email: 'charlie.williams@example.com', ps: 'PS2001' },
    { name: 'Dana Brown', email: 'dana.brown@example.com', ps: 'PS2002' },
  ],
};

const LoginPage: React.FC = () => {
  const [userGroup, setUserGroup] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userGroup) {
      toast.error('Please select a user group');
      return;
    }

    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    // Save user details in localStorage
    localStorage.setItem('userName', selectedUser.name);
    localStorage.setItem('userEmail', selectedUser.email);
    localStorage.setItem('userPS', selectedUser.ps);

    // Navigate based on group
    if (userGroup === 'IT') {
      navigate('/it-helpdesk-view');
    } else {
      navigate('/');
    }
  };

  const handleGroupSelect = (group: string) => {
    setUserGroup(group);
    setSelectedUser(null);
    setIsGroupDropdownOpen(false);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setIsUserDropdownOpen(false);
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
              {/* Group Dropdown */}
              <div className="mb-6">
                <label className="form-label block mb-2">User Group</label>
                <div className="relative">
                  <button
                    type="button"
                    className="form-input flex justify-between items-center w-full cursor-pointer"
                    onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                  >
                    <span>{userGroup || 'Select  Group'}</span>
                    <ChevronDown className="h-5 w-5 text-lt-grey" />
                  </button>
                  {isGroupDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-lt-lightGrey rounded-md shadow-lg">
                      <ul>
                        <li
                          className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                          onClick={() => handleGroupSelect('IT')}
                        >
                          Infrastructure
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                          onClick={() => handleGroupSelect('Others')}
                        >
                          Application
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* User Dropdown */}
              {userGroup && (
                <div className="mb-6">
                  <label className="form-label block mb-2">User</label>
                  <div className="relative">
                    <button
                      type="button"
                      className="form-input flex justify-between items-center w-full cursor-pointer"
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    >
                      <span>{selectedUser?.name || 'Select User'}</span>
                      <ChevronDown className="h-5 w-5 text-lt-grey" />
                    </button>
                    {isUserDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-lt-lightGrey rounded-md shadow-lg max-h-48 overflow-y-auto">
                        <ul>
                          {mockUsers[userGroup].map((user) => (
                            <li
                              key={user.email}
                              className="px-4 py-2 hover:bg-lt-lightGrey cursor-pointer"
                              onClick={() => handleUserSelect(user)}
                            >
                              {user.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
