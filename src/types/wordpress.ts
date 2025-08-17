export interface WordPressCredentials {
  siteUrl: string;
  username: string;
  applicationPassword: string;
}

export interface WordPressPost {
  title: string;
  content: string;
  status: 'draft' | 'publish';
  excerpt?: string;
}

export interface WordPressPublishResult {
  success: boolean;
  postId?: number;
  postUrl?: string;
  error?: string;
}