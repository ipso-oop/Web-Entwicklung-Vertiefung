export interface User {
  _id?: string;
  username: string;
  email: string;
  role: 'student' | 'teacher';
  createdAt?: Date;
}

export interface GameRating {
  _id?: string;
  gameId: string;
  userId: string;
  rating: number;
  review: string;
  date: Date;
  helpfulVotes: number;
  reportedIssues: GameIssue[];
}

export interface GameIssue {
  _id?: string;
  type: 'bug' | 'suggestion' | 'feedback';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  severity: 'low' | 'medium' | 'high';
  submittedBy: string;
  submittedAt: Date;
  gameId: string;
}

export interface GameStats {
  _id?: string;
  gameId: string;
  userId: string;
  playTime: number;
  highScore: number;
  lastPlayed: Date;
  achievements: Achievement[];
}

export interface Achievement {
  _id?: string;
  name: string;
  description: string;
  unlockedAt: Date;
  gameId: string;
}

export interface GameProgress {
  gamesPlayed: number;
  totalPlayTime: number;
  ratingsSubmitted: number;
  issuesReported: number;
  lastActive: Date;
} 