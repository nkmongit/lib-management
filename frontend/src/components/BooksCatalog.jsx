import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

function BooksCatalog() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axios.get('/api/books');
        setBooks(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch books.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const categories = useMemo(() => {
    const catSet = new Set();
    books.forEach((book) => {
      if (book.categories && Array.isArray(book.categories)) {
        book.categories.forEach((cat) => catSet.add(cat));
      }
    });
    return ['All', ...Array.from(catSet)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    let filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (book) =>
          book.categories && book.categories.includes(selectedCategory)
      );
    }
    return filtered;
  }, [books, searchTerm, selectedCategory]);

  const sortedBooks = useMemo(() => {
    const sorted = [...filteredBooks];
    if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'price') {
      sorted.sort((a, b) => a.price - b.price);
    }
    return sorted;
  }, [filteredBooks, sortBy]);

  const buyBook = async (bookId) => {
    try {
      await axios.post(`/api/books/${bookId}/buy`);
      toast.success('Book purchased successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to purchase book.');
    }
  };

  const rentBook = async (bookId) => {
    try {
      await axios.post(`/api/books/${bookId}/rent`);
      toast.success('Book rented successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to rent book.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-center mb-8 text-gray-800"
        >
          Library Catalog
        </motion.h1>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow bg-white"
              >
                <option value="title">Sort by Title</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sortedBooks.map((book) => (
              <motion.div
                key={book._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-xl"
              >
                <div className="relative pb-[60%]">
                  <img
                    src={book.image || 'https://via.placeholder.com/200x250?text=No+Image'}
                    alt={book.title}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{book.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-blue-600">
                      ${book.price}
                    </span>
                    <span className="text-sm text-gray-600">
                      Rent: ${book.rentalPrice}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => buyBook(book._id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                    >
                      Buy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => rentBook(book._id)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
                    >
                      Rent
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {!isLoading && sortedBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-600"
          >
            No books found matching your criteria.
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default BooksCatalog;