import React, { useState } from 'react';
import { Rating as RatingType } from '../services/ratingService';
import ratingService from '../services/ratingService';
import './RatingForm.css';

interface RatingFormProps {
  gameId: string;
  onRatingSubmitted?: (rating: RatingType) => void;
}

const RatingForm: React.FC<RatingFormProps> = ({ gameId, onRatingSubmitted }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      const newRating = await ratingService.createRating({
        game: gameId,
        rating,
        comment
      });
      
      if (onRatingSubmitted) {
        onRatingSubmitted(newRating);
      }
      
      // Reset form
      setRating(0);
      setComment('');
    } catch (err) {
      setError('Failed to submit rating. Please try again.');
      console.error('Error submitting rating:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rating-form">
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${rating >= star ? 'active' : ''}`}
            onClick={() => setRating(star)}
          >
            ★
          </button>
        ))}
      </div>
      
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment (optional)"
        className="rating-comment"
      />
      
      {error && <div className="error-message">{error}</div>}
      
      <button type="submit" className="submit-button">
        Submit Rating
      </button>
    </form>
  );
};

export default RatingForm; 