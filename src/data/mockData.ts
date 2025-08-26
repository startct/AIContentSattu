import { User, Analysis } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'demo@contentai.com',
  name: 'Sarah Johnson'
};

export const mockAnalyses: Analysis[] = [
  {
    id: '1',
    title: 'Digital Marketing Trends 2024',
    topic: 'Digital Marketing',
    description: 'Comprehensive analysis of emerging digital marketing trends and strategies for 2024, including AI integration and customer personalization.',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    contentType: 'article',
    wordCount: 2847
  },
  {
    id: '2',
    title: 'Sustainable Living Guide',
    topic: 'Sustainability',
    description: 'Complete guide to sustainable living practices, eco-friendly products, and reducing environmental impact in daily life.',
    status: 'completed',
    createdAt: '2024-01-12T14:22:00Z',
    contentType: 'blog',
    wordCount: 3124
  },
  {
    id: '3',
    title: 'AI in Healthcare Analysis',
    topic: 'Artificial Intelligence',
    description: 'Deep dive into AI applications in healthcare, including diagnostic tools, treatment recommendations, and patient care improvements.',
    status: 'processing',
    createdAt: '2024-01-18T09:15:00Z',
    contentType: 'article',
    wordCount: 1892
  },
  {
    id: '4',
    title: 'Social Media Strategy 2024',
    topic: 'Social Media Marketing',
    description: 'Strategic approach to social media marketing, platform-specific tactics, and engagement optimization techniques.',
    status: 'completed',
    createdAt: '2024-01-10T16:45:00Z',
    contentType: 'social',
    wordCount: 2156
  },
  {
    id: '5',
    title: 'Email Marketing Automation',
    topic: 'Email Marketing',
    description: 'Advanced email marketing automation strategies, personalization techniques, and performance optimization methods.',
    status: 'draft',
    createdAt: '2024-01-20T11:30:00Z',
    contentType: 'email',
    wordCount: 1674
  },
  {
    id: '6',
    title: 'Remote Work Productivity',
    topic: 'Productivity',
    description: 'Best practices for maintaining productivity while working remotely, tools, and team collaboration strategies.',
    status: 'completed',
    createdAt: '2024-01-08T13:20:00Z',
    contentType: 'blog',
    wordCount: 2543
  }
];