import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
              <path d="M8 8h8c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4l6 8h-3l-5-7h-2v7H8V8zm2 2v6h6c1.1 0 2-.9 2-2s-.9-2-2-2h-6z" fill="white"/>
              <defs>
                                 <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0.2}} />
                   <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0.1}} />
                 </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ramton CRM</h2>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-gray-600">Yüklənir...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the current location as the return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 