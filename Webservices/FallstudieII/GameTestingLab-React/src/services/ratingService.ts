import axios from 'axios';

export interface Rating {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  game: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateRatingDto {
  game: string;
  rating: number;
  comment?: string;
}

const API_URL = 'http://localhost:5000/api';

class RatingService {
  async createRating(ratingData: CreateRatingDto): Promise<Rating> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    try {
      console.log('Sending rating data:', ratingData);
      console.log('Using token:', token.substring(0, 10) + '...');
      
      const response = await axios.post(`${API_URL}/ratings`, ratingData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Rating created successfully:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Rating creation failed:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        throw new Error(error.response?.data?.msg || error.message);
      }
      throw error;
    }
  }

  async getGameRatings(gameId: string): Promise<Rating[]> {
    try {
      const response = await axios.get(`${API_URL}/ratings/game/${gameId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to fetch game ratings:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  }

  async getUserRatings(): Promise<Rating[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    try {
      const response = await axios.get(`${API_URL}/ratings/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to fetch user ratings:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  }

  async deleteRating(ratingId: string): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    try {
      await axios.delete(`${API_URL}/ratings/${ratingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to delete rating:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  }
}

export default new RatingService(); 