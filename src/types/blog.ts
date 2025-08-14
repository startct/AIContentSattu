export interface BlogTopic {
  id: string;
  title: string;
  status: 'pending' | 'generating' | 'completed' | 'error';
}

export interface GeneratedBlog {
  id: string;
  topic: string;
  title: string;
  content: string;
  summary: string;
  wordCount: number;
  generatedAt: Date;
}