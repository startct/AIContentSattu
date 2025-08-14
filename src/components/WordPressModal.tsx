import React, { useState } from 'react';
import { X, Globe, User, Key, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { WordPressCredentials } from '../types/wordpress';
import { wordpressService } from '../services/wordpressService';

interface WordPressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (credentials: WordPressCredentials, publishType: 'draft' | 'publish') => void;
}

export const WordPressModal: React.FC<WordPressModalProps> = ({ isOpen, onClose, onPublish }) => {
  const [credentials, setCredentials] = useState<WordPressCredentials>({
    siteUrl: '',
    username: '',
    applicationPassword: '',
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (field: keyof WordPressCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    setConnectionStatus('idle');
    setConnectionError('');
  };

  const testConnection = async () => {
    if (!credentials.siteUrl || !credentials.username || !credentials.applicationPassword) {
      setConnectionError('Please fill in all fields');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');
    setConnectionError('');

    wordpressService.setCredentials(credentials);
    const result = await wordpressService.testConnection();

    setIsTestingConnection(false);
    
    if (result.success) {
      setConnectionStatus('success');
    } else {
      setConnectionStatus('error');
      setConnectionError(result.error || 'Connection failed');
    }
  };

  const handlePublish = (publishType: 'draft' | 'publish') => {
    if (connectionStatus !== 'success') {
      setConnectionError('Please test the connection first');
      return;
    }
    onPublish(credentials, publishType);
  };

  const formatSiteUrl = (url: string) => {
    if (!url) return url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Publish to WordPress</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe size={16} className="inline mr-2" />
                WordPress Site URL
              </label>
              <input
                type="url"
                value={credentials.siteUrl}
                onChange={(e) => handleInputChange('siteUrl', formatSiteUrl(e.target.value))}
                placeholder="https://yoursite.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Your WordPress username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key size={16} className="inline mr-2" />
                Application Password
              </label>
              <input
                type="password"
                value={credentials.applicationPassword}
                onChange={(e) => handleInputChange('applicationPassword', e.target.value)}
                placeholder="Your WordPress application password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                Generate this in WordPress Admin → Users → Profile → Application Passwords
              </p>
            </div>

            <button
              onClick={testConnection}
              disabled={isTestingConnection || !credentials.siteUrl || !credentials.username || !credentials.applicationPassword}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isTestingConnection ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Testing Connection...
                </>
              ) : (
                'Test Connection'
              )}
            </button>

            {connectionStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle size={20} />
                <span className="font-medium">Connection successful!</span>
              </div>
            )}

            {connectionStatus === 'error' && (
              <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Connection failed</p>
                  <p className="text-sm">{connectionError}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handlePublish('draft')}
              disabled={connectionStatus !== 'success'}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Publish as Drafts
            </button>
            <button
              onClick={() => handlePublish('publish')}
              disabled={connectionStatus !== 'success'}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Publish Live
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};