import React from 'react';
import { useGameTesting } from '../../context/GameTestingContext';
import { Link } from 'react-router-dom';

const GameList: React.FC = () => {
  const { games, ratings } = useGameTesting();

  const getAverageRating = (gameId: string) => {
    const gameRatings = ratings.filter((r) => r.game === gameId);
    if (gameRatings.length === 0) return 0;
    const sum = gameRatings.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / gameRatings.length).toFixed(1);
  };

  const getRatingCount = (gameId: string) => {
    return ratings.filter((r) => r.game === gameId).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Student Game Testing Lab</h1>
        <p className="text-gray-300 text-lg">
          Play, test, and provide feedback on educational games
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48 bg-gray-700">
              <img
                src={game.thumbnail}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded">
                {game.difficulty}
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-white mb-2">{game.title}</h2>
              <p className="text-gray-300 mb-4">{game.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-white">{getAverageRating(game.id)}</span>
                  </div>
                  <span className="text-gray-400">({getRatingCount(game.id)} ratings)</span>
                </div>
                <Link
                  to={`/game/${game.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300"
                >
                  Play & Rate
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList; 