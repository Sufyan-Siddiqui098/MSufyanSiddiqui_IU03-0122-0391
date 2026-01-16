import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">Page not found</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
