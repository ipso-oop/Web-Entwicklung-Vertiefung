import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Game } from '../types/game';
import { User } from '../types/database';
import { useAuth } from './AuthContext';
import ratingService, { Rating, CreateRatingDto } from '../services/ratingService';
import ShooterGame from '../components/game/ShooterGame';
import PacmanGame from '../components/game/PacmanGame';

interface GameTestingContextType {
  games: Game[];
  ratings: Rating[];
  currentUser: User | null;
  addRating: (rating: CreateRatingDto) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const GameTestingContext = createContext<GameTestingContextType | undefined>(undefined);

const initialGames: Game[] = [
  {
    id: '1',
    title: 'Space Shooter',
    description: 'A classic space shooter game where you control a spaceship and destroy asteroids.',
    component: ShooterGame,
    thumbnail: '/thumbnails/shooter.png',
    category: 'Action',
    difficulty: 'Medium',
  },
  {
    id: '2',
    title: 'Pacman',
    description: 'Navigate through a maze, eat dots, and avoid ghosts in this classic arcade game.',
    component: PacmanGame,
    thumbnail: '/thumbnails/pacman.png',
    category: 'Arcade',
    difficulty: 'Easy',
  },
  // Add more games here as they are developed
];

export const useGameTesting = () => {
  const context = useContext(GameTestingContext);
  if (!context) {
    throw new Error('useGameTesting must be used within a GameTestingProvider');
  }
  return context;
};

interface GameTestingProviderProps {
  children: ReactNode;
}

export const GameTestingProvider: React.FC<GameTestingProviderProps> = ({ children }) => {
  const { authState } = useAuth();
  const [games] = useState<Game[]>(initialGames);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update currentUser whenever authState changes
  const currentUser = authState.user;

  // Load all ratings when component mounts
  useEffect(() => {
    const loadAllRatings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allRatings = await Promise.all(
          games.map(game => ratingService.getGameRatings(game.id))
        );
        setRatings(allRatings.flat());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ratings');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllRatings();
  }, [games]);

  const addRating = async (rating: CreateRatingDto) => {
    if (!currentUser) {
      throw new Error('User must be logged in to submit a rating');
    }

    try {
      setIsLoading(true);
      setError(null);
      const newRating = await ratingService.createRating(rating);
      setRatings((prev) => [...prev, newRating]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GameTestingContext.Provider
      value={{
        games,
        ratings,
        currentUser,
        addRating,
        isLoading,
        error,
      }}
    >
      {children}
    </GameTestingContext.Provider>
  );
}; 