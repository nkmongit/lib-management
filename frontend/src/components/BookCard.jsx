// frontend/src/components/BookCard.jsx
import React from 'react';

const BookCard = ({ book, handleBookClick, handleImageError }) => {
  return (
    <div
      className="w-32 flex-shrink-0 bg-white rounded shadow hover:scale-105 transform transition duration-300 cursor-pointer"
      onClick={() => handleBookClick(book._id)}
    >
      {book.image ? (
        <img 
          src={book.image} 
          alt={book.title} 
          onError={handleImageError}
          className="w-full h-32 object-cover rounded-t"
        />
      ) : (
        <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-t">
          <span className="text-gray-500 text-xs">No Image</span>
        </div>
      )}
      <div className="p-1">
        <h4 className="font-bold text-xs">{book.title}</h4>
        <p className="text-[10px] text-gray-600">{book.author}</p>
      </div>
    </div>
  );
};

export default BookCard;
