import React, { useState } from 'react';
import { Clock, FileText, Download, Eye, EyeOff, Edit3, Save, X } from 'lucide-react';
import { GeneratedBlog } from '../types/blog';

interface BlogCardProps {
  blog: GeneratedBlog;
  onUpdateBlog: (updatedBlog: GeneratedBlog) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, onUpdateBlog }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState({
    title: blog.title,
    content: blog.content,
    summary: blog.summary
  });

  const exportBlog = () => {
    const content = `# ${blog.title}\n\n${blog.content}\n\n---\n\n**Summary:** ${blog.summary}\n**Word Count:** ${blog.wordCount}\n**Generated:** ${blog.generatedAt.toLocaleDateString()}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blog.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const wordCount = editedBlog.content.split(/\s+/).length;
    const updatedBlog: GeneratedBlog = {
      ...blog,
      title: editedBlog.title,
      content: editedBlog.content,
      summary: editedBlog.summary,
      wordCount
    };
    onUpdateBlog(updatedBlog);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBlog({
      title: blog.title,
      content: blog.content,
      summary: blog.summary
    });
    setIsEditing(false);
  };
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold text-gray-800 mb-4 mt-6">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold text-gray-800 mb-3 mt-5">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium text-gray-800 mb-2 mt-4">{line.substring(4)}</h3>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-gray-600 mb-3 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedBlog.title}
              onChange={(e) => setEditedBlog(prev => ({ ...prev, title: e.target.value }))}
              className="text-xl font-bold text-gray-800 flex-1 pr-4 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Blog title"
            />
          ) : (
            <h3 className="text-xl font-bold text-gray-800 flex-1 pr-4">{blog.title}</h3>
          )}
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                  title="Save changes"
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Cancel editing"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                  title="Edit blog"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={exportBlog}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  title="Export blog"
                >
                  <Download size={20} />
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <FileText size={16} />
            <span>{blog.wordCount} words</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{blog.generatedAt.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
          {isEditing ? (
            <textarea
              value={editedBlog.summary}
              onChange={(e) => setEditedBlog(prev => ({ ...prev, summary: e.target.value }))}
              className="w-full text-gray-600 text-sm leading-relaxed border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Blog summary"
            />
          ) : (
            <p className="text-gray-600 text-sm leading-relaxed">{blog.summary}</p>
          )}
        </div>

        {!isEditing && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            {showFullContent ? <EyeOff size={20} /> : <Eye size={20} />}
            {showFullContent ? 'Hide Full Content' : 'Show Full Content'}
          </button>
        )}
      </div>

      {isEditing && (
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <h4 className="font-semibold text-gray-800 mb-3">Edit Content</h4>
          <textarea
            value={editedBlog.content}
            onChange={(e) => setEditedBlog(prev => ({ ...prev, content: e.target.value }))}
            className="w-full h-96 text-gray-600 text-sm leading-relaxed border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
            placeholder="Blog content (supports Markdown)"
          />
          <p className="text-xs text-gray-500 mt-2">
            Word count: {editedBlog.content.split(/\s+/).filter(word => word.length > 0).length}
          </p>
        </div>
      )}

      {showFullContent && !isEditing && (
        <div className="p-6 bg-gray-50 border-t border-gray-100 max-h-96 overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            {formatContent(blog.content)}
          </div>
        </div>
      )}
    </div>
  );
};