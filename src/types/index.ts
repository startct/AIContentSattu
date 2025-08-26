export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Analysis {
  id: string;
  title: string;
  topic: string;
  description: string;
  status: 'completed' | 'processing' | 'draft';
  createdAt: string;
  contentType: 'article' | 'blog' | 'social' | 'email';
  wordCount: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}