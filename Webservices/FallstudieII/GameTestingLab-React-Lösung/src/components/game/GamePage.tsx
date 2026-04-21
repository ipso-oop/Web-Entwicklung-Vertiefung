import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameTesting } from '../../context/GameTestingContext';
import { useAuth } from '../../context/AuthContext';

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { games, addRating, error: contextError } = useGameTesting();
  const { authState } = useAuth();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const game = games.find((g) => g.id === gameId);
  const GameComponent = game?.component;

  if (!game || !GameComponent) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-2xl font-bold mb-4">Game not found</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Games
        </button>
      </div>
    );
  }

  const handleSubmitRating = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      if (!authState.isAuthenticated) {
        setError('Please log in to submit a rating');
        return;
      }

      setIsSubmitting(true);
      setError(null);

      const newRating = {
        game: game.id,
        rating,
        comment: review,
      };

      await addRating(newRating);
      setReview('');
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded mb-4"
        >
          ← Back to Games
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">{game.title}</h1>
        <p className="text-gray-300">{game.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <GameComponent />
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Rate this Game</h2>
          {(error || contextError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error || contextError}
            </div>
          )}
          <form onSubmit={handleSubmitRating}>
            <div className="mb-4">
              <label className="block text-white mb-2">Rating</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    disabled={isSubmitting}
                    className={`text-2xl ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                disabled={isSubmitting}
                className={`w-full h-32 bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="Share your thoughts about the game..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GamePage; 