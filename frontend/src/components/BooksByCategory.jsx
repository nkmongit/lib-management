import React from 'react';
import BookCard from './BookCard';

const BooksByCategory = ({ groupedBooks, loading, error, handleBookClick, handleImageError }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Books by Category</h2>
      {loading ? (
        <p>Loading books...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        Object.keys(groupedBooks).map(category => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-bold mb-2">{category}</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 border-b border-gray-300">
              {groupedBooks[category].map(book => (
                <BookCard 
                  key={book._id} 
                  book={book} 
                  handleBookClick={handleBookClick} 
                  handleImageError={handleImageError}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BooksByCategory;
