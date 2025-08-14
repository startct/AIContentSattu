import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { BlogTopic } from '../types/blog';

interface GenerationProgressProps {
  topics: BlogTopic[];
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({ topics }) => {
  if (topics.length === 0) return null;

  const completedCount = topics.filter(t => t.status === 'completed').length;
  const errorCount = topics.filter(t => t.status === 'error').length;
  const progressPercentage = ((completedCount + errorCount) / topics.length) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Generation Progress</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{completedCount + errorCount} / {topics.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {topics.map((topic) => (
          <div key={topic.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              {topic.status === 'generating' && (
                <Loader2 size={20} className="text-blue-600 animate-spin" />
              )}
              {topic.status === 'completed' && (
                <CheckCircle size={20} className="text-green-600" />
              )}
              {topic.status === 'error' && (
                <AlertCircle size={20} className="text-red-600" />
              )}
              {topic.status === 'pending' && (
                <div className="w-5 h-5 rounded-full bg-gray-300" />
              )}
            </div>
            <span className="flex-1 text-gray-700">{topic.title}</span>
            <span className="text-sm text-gray-500 capitalize">
              {topic.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};