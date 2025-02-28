// frontend/src/AppContent.jsx
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './slices/authSlice';

import Landing from './components/Landing';
import AdminDashboard from './components/AdminDashboard';
import BooksCatalog from './components/BooksCatalog';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import UserList from './components/UserList';
import ErrorPage from './components/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';


function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map((word) => word[0]).join('').toUpperCase();
  };

  const avatarUrl = userInfo?.avatar
    ? `https://avatars.dicebear.com/api/adventurer-neutral/${encodeURIComponent(
        userInfo.name
      )}.svg`
    : null;

  const navVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const linkVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col"
    >
      {/* Enhanced Navigation Bar */}
      <motion.nav 
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left Side: Navigation Links */}
          <div className="flex items-center space-x-6">
            <motion.div
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link to="/" className="text-gray-800 font-semibold hover:text-blue-600 transition-colors">
                Home
              </Link>
            </motion.div>
            
            {userInfo ? (
              <>
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link to="/catalog" className="text-gray-800 font-semibold hover:text-blue-600 transition-colors">
                    Catalog
                  </Link>
                </motion.div>
                {userInfo.role === 'admin' && (
                  <>
                    <motion.div
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link to="/admin" className="text-gray-800 font-semibold hover:text-blue-600 transition-colors">
                        Admin
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link to="/userlist" className="text-gray-800 font-semibold hover:text-blue-600 transition-colors">
                        User List
                      </Link>
                    </motion.div>
                  </>
                )}
              </>
            ) : (
              <>
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link to="/login" className="text-gray-800 font-semibold hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link to="/register" className="text-gray-800 font-semibold hover:text-blue-600 transition-colors">
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Right Side: Profile Avatar & Logout */}
          {userInfo && (
            <div className="flex items-center space-x-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link to="/profile" className="relative group">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-blue-500 ring-offset-2">
                      {getInitials(userInfo.name)}
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                  >
                    View Profile
                  </motion.div>
                </Link>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  dispatch(logout());
                  navigate('/');
                }}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <span>Logout</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Main Content with Page Transitions */}
      <motion.div 
        className="flex-1 container mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Landing />} />
            
            {/* Protected Routes */}
            <Route 
              path="/catalog" 
              element={
                <ProtectedRoute>
                  <BooksCatalog />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/userlist" 
              element={
                <ProtectedRoute adminOnly>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default AppContent;