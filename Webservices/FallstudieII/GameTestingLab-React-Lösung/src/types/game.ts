export interface Game {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  thumbnail: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface GameRating {
  id: string;
  gameId: string;
  userId: string;
  rating: number;
  review: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher';
} 