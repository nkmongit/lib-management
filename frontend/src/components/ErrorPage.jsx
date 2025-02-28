// frontend/src/components/ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Oops! Page not found.</p>
      <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded">
        Go back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
