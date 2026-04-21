import React, { useState } from 'react';
import PacmanGame from '../components/game/PacmanGame';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const GamePage: React.FC = () => {
  const { authState } = useAuth();
  
  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col items-center bg-gray-900 min-h-screen py-8 px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">
          Game Site
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <PacmanGame />
        </div>
        
      </div>
      
     
    </div>
  );
};

export default GamePage;