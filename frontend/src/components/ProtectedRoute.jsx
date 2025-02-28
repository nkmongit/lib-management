// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // If not logged in, redirect to login
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // If route is admin only and the user is not admin, redirect to error or dashboard
  if (adminOnly && userInfo.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
