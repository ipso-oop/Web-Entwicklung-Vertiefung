import React from 'react';
import Pacman from 'pacman-react';

const PacmanGame: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative bg-black rounded-lg overflow-hidden shadow-lg border-4 border-blue-500">
        <Pacman />
      </div>
      <div className="mt-4 text-white">
        <p className="text-sm text-gray-400">Controls: Arrow keys to move</p>
      </div>
    </div>
  );
};

export default PacmanGame;