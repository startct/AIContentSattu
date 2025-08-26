import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MoreHorizontal,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Analysis, User as UserType } from '../types';

interface DashboardProps {
  user: UserType;
  analyses: Analysis[];
  onViewAnalysis: (analysis: Analysis) => void;
  onCreateNew: () => void;
  onLogout: () => void;
}

export function Dashboard({ user, analyses, onViewAnalysis, onCreateNew, onLogout }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         analysis.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || analysis.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: Analysis['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'draft':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Analysis['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getContentTypeIcon = (type: Analysis['contentType']) => {
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">ContentAI</h1>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block font-medium">{user.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Content Analyses</h2>
          <p className="text-gray-600">Manage and review your AI-generated content</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search analyses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* New Analysis Button */}
          <button
            onClick={onCreateNew}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>New Analysis</span>
          </button>
        </div>

        {/* Analyses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnalyses.map((analysis) => (
            <div
              key={analysis.id}
              onClick={() => onViewAnalysis(analysis)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group transform hover:scale-105"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    {getContentTypeIcon(analysis.contentType)}
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {analysis.contentType}
                    </span>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {analysis.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {analysis.description}
                </p>

                {/* Topic */}
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {analysis.topic}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(analysis.status)}
                    {getStatusBadge(analysis.status)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Word Count */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 flex justify-between items-center">
                    <span>Word count: {analysis.wordCount.toLocaleString()}</span>
                    <span>{analysis.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAnalyses.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all' ? 'No analyses found' : 'No content analyses yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first AI-powered content analysis to get started'
              }
            </p>
            {(!searchQuery && filterStatus === 'all') && (
              <button
                onClick={onCreateNew}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Analysis</span>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}