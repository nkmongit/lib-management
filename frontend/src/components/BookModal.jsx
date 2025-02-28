// frontend/src/components/BookModal.jsx
import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const BookModal = ({
  selectedBookData,
  updatePrices,
  setUpdatePrices,
  updatePriceHandler,
  closeModal,
  handleImageError,
  handleDeleteBook  // Optional: if provided, deletion is available
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const onDeleteConfirm = () => {
    if (handleDeleteBook) {
      handleDeleteBook(selectedBookData.book._id);
    }
    setShowConfirm(false);
    closeModal();
  };

  const onDeleteCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="relative bg-white rounded shadow-lg max-w-2xl w-full p-6 animate-fadeIn">
          {handleDeleteBook && (
            <button 
              onClick={() => setShowConfirm(true)}
              className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete Book
            </button>
          )}
          <button 
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={closeModal}
          >
            Close
          </button>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              {selectedBookData.book.image ? (
                <img 
                  src={selectedBookData.book.image} 
                  alt={selectedBookData.book.title} 
                  onError={handleImageError}
                  className="w-full h-auto rounded"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
            <div className="md:w-2/3 md:pl-4 mt-4 md:mt-0">
              <h2 className="text-2xl font-bold">{selectedBookData.book.title}</h2>
              <p className="text-gray-600 mb-2">by {selectedBookData.book.author}</p>
              <p className="mb-4">{selectedBookData.book.description}</p>
              <div className="mb-4">
                <label className="font-semibold">Price: </label>
                <input 
                  type="number"
                  className="border p-1 rounded ml-2"
                  value={updatePrices.price}
                  onChange={(e) => setUpdatePrices({ ...updatePrices, price: Number(e.target.value) })}
                />
              </div>
              <div className="mb-4">
                <label className="font-semibold">Rental Price: </label>
                <input 
                  type="number"
                  className="border p-1 rounded ml-2"
                  value={updatePrices.rentalPrice}
                  onChange={(e) => setUpdatePrices({ ...updatePrices, rentalPrice: Number(e.target.value) })}
                />
              </div>
              <button 
                onClick={updatePriceHandler}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
              >
                Update Prices
              </button>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Ratings</h3>
            {selectedBookData.book.ratings && selectedBookData.book.ratings.length > 0 ? (
              <ul className="list-disc pl-5">
                {selectedBookData.book.ratings.map((rating, index) => (
                  <li key={index}>
                    User: {rating.userId} - Rating: {rating.rating}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ratings yet.</p>
            )}
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Transactions</h3>
            {selectedBookData.transactions && selectedBookData.transactions.length > 0 ? (
              <ul className="list-disc pl-5">
                {selectedBookData.transactions.map((tx) => (
                  <li key={tx._id}>
                    {tx.user.name} ({tx.user.email}) - {tx.type}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No transactions yet.</p>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal 
        isOpen={showConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this book? This action cannot be undone."
        onConfirm={onDeleteConfirm}
        onCancel={onDeleteCancel}
      />
    </>
  );
};

export default BookModal;
