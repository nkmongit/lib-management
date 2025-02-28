// frontend/src/components/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../slices/booksSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserDashboard() {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);
  const { userInfo } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(fetchBooks());
    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/users/profile', config);
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [dispatch, userInfo.token]);


  const rentOrBuyHandler = async (bookId, type) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/transactions', { bookId, type }, config);
      alert(`Book ${type} successful!`);
    } catch (err) {
      console.error(err);
      alert('Transaction failed.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
      </div>
      
      {profile && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <div className="mt-4">
            <h3 className="font-semibold">Purchased Books:</h3>
            <ul>
              {profile.purchasedBooks.map(book => (
                <li key={book._id}>{book.title}</li>
              ))}
            </ul>
            <h3 className="font-semibold mt-4">Rented Books:</h3>
            <ul>
              {profile.rentedBooks.map(book => (
                <li key={book._id}>{book.title}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Library Books</h2>
        {loading ? (
          <p>Loading books...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="space-y-2">
            {books.map(book => (
              <li key={book._id} className="p-4 bg-white rounded shadow flex justify-between">
                <div>
                  <h3 className="font-bold">{book.title}</h3>
                  <p>{book.author}</p>
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={() => rentOrBuyHandler(book._id, 'rental')}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Rent
                  </button>
                  <button 
                    onClick={() => rentOrBuyHandler(book._id, 'purchase')}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    Buy
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
