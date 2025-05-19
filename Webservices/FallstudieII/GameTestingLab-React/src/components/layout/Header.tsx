import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GamepadIcon, UserIcon, LogOutIcon } from 'lucide-react';

const Header: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <GamepadIcon className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Game Testing Lab
            </span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            {authState.isAuthenticated ? (
              <>
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="text-white hover:text-blue-400 transition-colors flex items-center space-x-1">
                    <UserIcon className="h-5 w-5" />
                    <span>{authState.user?.username}</span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <LogOutIcon className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white font-medium hover:text-blue-400 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-400 transition-colors">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;