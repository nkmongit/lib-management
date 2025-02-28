import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

function Profile() {
  const { userInfo } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/users/profile', config);
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo) fetchProfile();
  }, [userInfo]);

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put('/api/users/profile', { name, email, password }, config);
      setProfile(data);
      setMessage('Profile updated successfully');
      setEdit(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data.message || err.message);
      toast.error(err.response?.data.message || err.message);
    }
  };

  const cancelUpdate = () => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
    setPassword('');
    setEdit(false);
    setMessage('');
  };

  const handleUnrent = async (bookId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.delete(`/api/users/unrent/${bookId}`, config);
      setProfile(data);
      toast.success('Book unrented successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to unrent book.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-8">My Profile</h1>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 mb-4 rounded ${
              message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="mb-8">
          <div className="flex border-b">
            {['details', 'purchased', 'rented'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setEdit(false);
                }}
                className={`px-6 py-3 text-base font-medium transition duration-200 ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'details' && (
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
            >
              {edit ? (
                <form onSubmit={updateHandler} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={cancelUpdate}
                      className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Name</h3>
                      <p className="mt-1 text-lg">{profile?.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-lg">{profile?.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Role</h3>
                      <p className="mt-1 text-lg capitalize">{profile?.role}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setEdit(true)}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'purchased' && (
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xl font-semibold mb-4">Purchased Books</h3>
              {profile?.purchasedBooks?.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {profile.purchasedBooks.map((book, index) => (
                    <motion.div
                      key={book._id || index}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium">{book.title}</h4>
                      <p className="text-gray-600">{book.author}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No purchased books found.</p>
              )}
            </motion.div>
          )}

          {activeTab === 'rented' && (
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xl font-semibold mb-4">Rented Books</h3>
              {profile?.rentedBooks?.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {profile.rentedBooks.map((book, index) => (
                    <motion.div
                      key={book._id || index}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{book.title}</h4>
                          <p className="text-gray-600">{book.author}</p>
                        </div>
                        <button
                          onClick={() => handleUnrent(book._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition duration-200"
                        >
                          Unrent
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No rented books found.</p>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;