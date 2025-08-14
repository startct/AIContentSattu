import { WordPressCredentials, WordPressPost, WordPressPublishResult } from '../types/wordpress';

export class WordPressService {
  private credentials: WordPressCredentials | null = null;

  setCredentials(credentials: WordPressCredentials) {
    this.credentials = credentials;
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.credentials) {
      return { success: false, error: 'No credentials provided' };
    }

    try {
      const response = await fetch(`${this.credentials.siteUrl}/wp-json/wp/v2/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${btoa(`${this.credentials.username}:${this.credentials.applicationPassword}`)}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}` 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Connection failed' 
      };
    }
  }

  async publishPost(post: WordPressPost): Promise<WordPressPublishResult> {
    if (!this.credentials) {
      return { success: false, error: 'No credentials provided' };
    }

    try {
      const response = await fetch(`${this.credentials.siteUrl}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.credentials.username}:${this.credentials.applicationPassword}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          status: post.status,
          excerpt: post.excerpt || '',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          postId: result.id,
          postUrl: result.link,
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Publishing failed',
      };
    }
  }

  async publishMultiplePosts(posts: WordPressPost[]): Promise<WordPressPublishResult[]> {
    const results: WordPressPublishResult[] = [];
    
    for (const post of posts) {
      const result = await this.publishPost(post);
      results.push(result);
      
      // Add a small delay between posts to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }
}

export const wordpressService = new WordPressService();