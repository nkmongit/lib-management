import React, { useEffect, useState, useMemo } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, addBook } from '../slices/booksSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import AddBookForm from './AddBookForm';
import CategoryFolders from './CategoryFolders';
import BooksList from './BooksList';
import BookModal from './BookModal';

const predefinedCategories = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Biography",
  "Mystery",
  "Fantasy",
  "Uncategorized"
];

function AdminDashboard() {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [newBook, setNewBook] = useState({
    title: '',
    description: '',
    author: '',
    isbn: '',
    category: [], // multiple categories as an array
    price: 0,
    rentalPrice: 0,
    image: '',
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBookData, setSelectedBookData] = useState(null); // { book, transactions }
  const [showModal, setShowModal] = useState(false);
  const [updatePrices, setUpdatePrices] = useState({
    price: 0,
    rentalPrice: 0,
  });

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const addBookHandler = (e) => {
    e.preventDefault();
    dispatch(addBook(newBook));
    setNewBook({
      title: '',
      description: '',
      author: '',
      isbn: '',
      category: [],
      price: 0,
      rentalPrice: 0,
      image: '',
    });
  };


  const handleBookClick = async (bookId) => {
    console.log('Book clicked, ID:', bookId);
    try {
      const { data } = await axios.get(`/api/books/${bookId}/details`);
      console.log('Received book details:', data);
      setSelectedBookData(data);
      setUpdatePrices({
        price: data.book.price,
        rentalPrice: data.book.rentalPrice,
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching book details:', error);
      toast.error('Failed to load book details.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBookData(null);
  };

  const updatePriceHandler = async () => {
    if (!selectedBookData) return;
    try {
      const { data } = await axios.put(`/api/books/${selectedBookData.book._id}`, {
        price: updatePrices.price,
        rentalPrice: updatePrices.rentalPrice,
      });
      setSelectedBookData((prev) => ({ ...prev, book: data }));
      toast.success('Prices updated successfully!');
      dispatch(fetchBooks());
    } catch (error) {
      console.error('Error updating prices:', error);
      toast.error('Failed to update prices.');
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
  };

  // Compute unique categories from books (each book.category is an array)
  const categories = useMemo(() => {
    const catSet = new Set();
    books.forEach((book) => {
      if (Array.isArray(book.category)) {
        book.category.forEach((cat) => catSet.add(cat));
      } else if (book.category) {
        catSet.add(book.category);
      } else {
        catSet.add('Uncategorized');
      }
    });
    return Array.from(catSet);
  }, [books]);

  // Filter books by selected category if one is selected; otherwise, return all books
  const filteredBooks = useMemo(() => {
    if (selectedCategory) {
      return books.filter((book) => {
        if (Array.isArray(book.category)) {
          return book.category.includes(selectedCategory);
        }
        return (book.category || 'Uncategorized') === selectedCategory;
      });
    }
    return books;
  }, [books, selectedCategory]);

  // Delete handler – only available for admins
// Inside AdminDashboard.jsx
const handleDeleteBook = async (bookId) => {
  // No window.confirm is used here; deletion is confirmed via the ConfirmModal.
  try {
    await axios.delete(`/api/books/${bookId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    toast.success('Book deleted successfully!');
    dispatch(fetchBooks());
  } catch (error) {
    console.error('Error deleting book:', error);
    toast.error('Failed to delete book.');
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </header>
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-[calc(100vh-150px)]">
          {/* Left Panel: Add New Book */}
          <Panel defaultSize={30} minSize={200} className="overflow-y-auto p-4">
            <AddBookForm 
              newBook={newBook} 
              setNewBook={setNewBook} 
              addBookHandler={addBookHandler} 
              predefinedCategories={predefinedCategories} 
            />
          </Panel>
          {/* Right Panel: Categories and Books List */}
          <Panel defaultSize={70} minSize={200} className="overflow-y-auto p-4">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
              <CategoryFolders 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
              />
            </div>
            <div className="mb-6">
              <BooksList 
                books={filteredBooks} 
                handleBookClick={handleBookClick} 
                handleImageError={handleImageError} 
              />
            </div>
          </Panel>
        </PanelGroup>
      </main>
      {/* Book Modal */}
      {showModal && selectedBookData && (
      <BookModal 
        selectedBookData={selectedBookData} 
        updatePrices={updatePrices} 
        setUpdatePrices={setUpdatePrices} 
        updatePriceHandler={updatePriceHandler} 
        closeModal={closeModal} 
        handleImageError={handleImageError}
        handleDeleteBook={userInfo?.role === 'admin' ? handleDeleteBook : null}
      />
    )}
    </div>
  );
}

export default AdminDashboard;
