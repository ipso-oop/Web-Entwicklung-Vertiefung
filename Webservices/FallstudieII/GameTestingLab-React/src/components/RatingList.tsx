import React, { useEffect, useState } from 'react';
import { Rating } from '../services/ratingService';
import ratingService from '../services/ratingService';
import './RatingList.css';

interface RatingListProps {
  gameId: string;
}

const RatingList: React.FC<RatingListProps> = ({ gameId }) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await ratingService.getGameRatings(gameId);
        setRatings(data);
      } catch (err) {
        setError('Failed to load ratings');
        console.error('Error loading ratings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [gameId]);

  if (loading) {
    return <div className="loading">Loading ratings...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (ratings.length === 0) {
    return <div className="no-ratings">No ratings yet</div>;
  }

  return (
    <div className="rating-list">
      {ratings.map((rating) => (
        <div key={rating._id} className="rating-item">
          <div className="rating-header">
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${index < rating.rating ? 'active' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="rating-date">
              {new Date(rating.createdAt).toLocaleDateString()}
            </div>
          </div>
          {rating.comment && (
            <div className="rating-comment">{rating.comment}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RatingList; 