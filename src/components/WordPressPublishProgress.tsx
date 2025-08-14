import React from 'react';
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { WordPressPublishResult } from '../types/wordpress';

interface WordPressPublishProgressProps {
  isPublishing: boolean;
  results: WordPressPublishResult[];
  blogTitles: string[];
  onClose: () => void;
}

export const WordPressPublishProgress: React.FC<WordPressPublishProgressProps> = ({
  isPublishing,
  results,
  blogTitles,
  onClose,
}) => {
  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success).length;
  const totalBlogs = blogTitles.length;
  const completedCount = results.length;

  if (!isPublishing && results.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Publishing to WordPress</h2>
            {!isPublishing && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                ×
              </button>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completedCount} / {totalBlogs}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / totalBlogs) * 100}%` }}
              />
            </div>
          </div>

          {(successCount > 0 || errorCount > 0) && (
            <div className="flex gap-4 mb-6">
              {successCount > 0 && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={20} />
                  <span className="font-medium">{successCount} published</span>
                </div>
              )}
              {errorCount > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={20} />
                  <span className="font-medium">{errorCount} failed</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            {blogTitles.map((title, index) => {
              const result = results[index];
              const isProcessing = isPublishing && index === completedCount;
              const isPending = index > completedCount;

              return (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {isProcessing && (
                      <Loader2 size={20} className="text-blue-600 animate-spin" />
                    )}
                    {result?.success && (
                      <CheckCircle size={20} className="text-green-600" />
                    )}
                    {result && !result.success && (
                      <AlertCircle size={20} className="text-red-600" />
                    )}
                    {isPending && (
                      <div className="w-5 h-5 rounded-full bg-gray-300" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{title}</p>
                    {result?.success && result.postUrl && (
                      <a
                        href={result.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-1"
                      >
                        View post <ExternalLink size={14} />
                      </a>
                    )}
                    {result && !result.success && (
                      <p className="text-sm text-red-600 mt-1">{result.error}</p>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {isProcessing && 'Publishing...'}
                    {result?.success && 'Published'}
                    {result && !result.success && 'Failed'}
                    {isPending && 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>

          {!isPublishing && completedCount === totalBlogs && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">
                Publishing completed! {successCount} of {totalBlogs} blogs were successfully published.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};