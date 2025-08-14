import { v4 as uuidv4 } from 'uuid';
import React, { useState, useCallback } from 'react';
import { PenTool, Sparkles, Upload } from 'lucide-react';
import { TopicInput } from './components/TopicInput';
import { BlogCard } from './components/BlogCard';
import { GenerationProgress } from './components/GenerationProgress';
import { WordPressModal } from './components/WordPressModal';
import { WordPressPublishProgress } from './components/WordPressPublishProgress';
import { generateBlog } from './services/blogService';
import { wordpressService } from './services/wordpressService';
import { BlogTopic, GeneratedBlog } from './types/blog';
import { WordPressCredentials, WordPressPublishResult } from './types/wordpress';

function App() {
  const [topics, setTopics] = useState<BlogTopic[]>([]);
  const [generatedBlogs, setGeneratedBlogs] = useState<GeneratedBlog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showWordPressModal, setShowWordPressModal] = useState(false);
  const [isPublishingToWordPress, setIsPublishingToWordPress] = useState(false);
  const [wordPressResults, setWordPressResults] = useState<WordPressPublishResult[]>([]);
  const [showPublishProgress, setShowPublishProgress] = useState(false);

  const handleUpdateBlog = useCallback((updatedBlog: GeneratedBlog) => {
    setGeneratedBlogs(prev => 
      prev.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
    );
  }, []);

  const handleAddTopics = useCallback(async (newTopics: string[], blogCount: number) => {
    // Create topic objects for each topic and each blog count
    const topicObjects: BlogTopic[] = [];
    
    newTopics.forEach(topicTitle => {
      for (let i = 1; i <= blogCount; i++) {
        topicObjects.push({
          id: uuidv4(),
          title: blogCount > 1 ? `${topicTitle} (Blog ${i})` : topicTitle,
          status: 'pending'
        });
      }
    });

    setTopics(topicObjects);
    setIsGenerating(true);

    // Generate blogs sequentially  
    for (let index = 0; index < topicObjects.length; index++) {
      const topic = topicObjects[index];
      const originalTopic = newTopics[Math.floor(index / blogCount)];
      const blogNumber = (index % blogCount) + 1;
      
      try {
        // Update status to generating
        setTopics(prev => prev.map(t => 
          t.id === topic.id ? { ...t, status: 'generating' } : t
        ));

        const blog = await generateBlog(originalTopic, blogNumber);
        
        // Update status to completed
        setTopics(prev => prev.map(t => 
          t.id === topic.id ? { ...t, status: 'completed' } : t
        ));

        // Add generated blog
        setGeneratedBlogs(prev => [...prev, blog]);
      } catch (error) {
        // Update status to error
        setTopics(prev => prev.map(t => 
          t.id === topic.id ? { ...t, status: 'error' } : t
        ));
        console.error('Error generating blog:', error);
      }
    }

    setIsGenerating(false);
  }, []);

  const handleWordPressPublish = async (credentials: WordPressCredentials, publishType: 'draft' | 'publish') => {
    setShowWordPressModal(false);
    setShowPublishProgress(true);
    setIsPublishingToWordPress(true);
    setWordPressResults([]);

    wordpressService.setCredentials(credentials);

    const posts = generatedBlogs.map(blog => ({
      title: blog.title,
      content: blog.content,
      status: publishType,
      excerpt: blog.summary,
    }));

    const results = await wordpressService.publishMultiplePosts(posts);
    setWordPressResults(results);
    setIsPublishingToWordPress(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <PenTool size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Blog Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transform your ideas into engaging blog posts with AI. Simply enter your topics and watch as comprehensive blogs are generated with summaries and analytics.
          </p>
        </div>

        {/* Topic Input */}
        <TopicInput onAddTopics={handleAddTopics} isGenerating={isGenerating} />

        {/* Generation Progress */}
        <GenerationProgress topics={topics} />

        {/* Generated Blogs */}
        {generatedBlogs.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles size={24} className="text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800">Generated Blogs</h2>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {generatedBlogs.length} blog{generatedBlogs.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <button
                onClick={() => setShowWordPressModal(true)}
                disabled={isGenerating || isPublishingToWordPress}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Upload size={20} />
                Publish to WordPress
              </button>
            </div>
            
            <div className="grid gap-8">
              {generatedBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} onUpdateBlog={handleUpdateBlog} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {generatedBlogs.length === 0 && topics.length === 0 && (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <PenTool size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Generate Amazing Content?</h3>
            <p className="text-gray-500">Enter your first blog topic above to get started with AI-powered content generation.</p>
          </div>
        )}
      </div>

      <WordPressModal
        isOpen={showWordPressModal}
        onClose={() => setShowWordPressModal(false)}
        onPublish={handleWordPressPublish}
      />

      <WordPressPublishProgress
        isPublishing={isPublishingToWordPress}
        results={wordPressResults}
        blogTitles={generatedBlogs.map(blog => blog.title)}
        onClose={() => setShowPublishProgress(false)}
      />
    </div>
  );
}

export default App;