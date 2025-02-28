import React, { useState, useMemo, useEffect } from 'react';
import BookCard from './BookCard';

const BooksList = ({ books, handleBookClick, handleImageError }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter books based on search term
  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  // Sort filtered books
  const sortedBooks = useMemo(() => {
    const sorted = [...filteredBooks];
    if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'price') {
      sorted.sort((a, b) => a.price - b.price);
    }
    return sorted;
  }, [filteredBooks, sortBy]);

  // Reset page whenever filteredBooks change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBooks]);

  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);
  const currentBooks = sortedBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div>
      {/* Search and Sort Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-48">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 pr-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-3 pr-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="title">Sort by Title</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </div>
      {/* Books Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
        {currentBooks.map((book) => (
          <BookCard 
            key={book._id} 
            book={book} 
            handleBookClick={handleBookClick} 
            handleImageError={handleImageError} 
          />
        ))}
      </div>
      {/* Pagination */}
      <div className="flex flex-col items-center mt-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-lg text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BooksList;
