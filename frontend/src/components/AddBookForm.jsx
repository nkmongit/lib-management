// frontend/src/components/AddBookForm.jsx
import React from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';

const AddBookForm = ({ newBook, setNewBook, addBookHandler, predefinedCategories }) => {
  return (
    <div className="mb-8 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2 text-center text-gray-800">
        Add New Book
      </h2>
      <form onSubmit={addBookHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <input
            type="text"
            placeholder="Title"
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Author"
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="ISBN"
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newBook.isbn}
            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Select Categories
          </label>
          <MultiSelectDropdown 
            options={predefinedCategories}
            selectedOptions={newBook.category}
            onChange={(selected) => setNewBook({ ...newBook, category: selected })}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Price"
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newBook.price}
            onChange={(e) => setNewBook({ ...newBook, price: Number(e.target.value) })}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Rental Price"
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newBook.rentalPrice}
            onChange={(e) => setNewBook({ ...newBook, rentalPrice: Number(e.target.value) })}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <input
            type="text"
            placeholder="Image URL"
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newBook.image}
            onChange={(e) => setNewBook({ ...newBook, image: e.target.value })}
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <textarea
            placeholder="Description"
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
          />
        </div>
        <div className="col-span-1 md:col-span-2 text-center">
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded shadow transition duration-300"
          >
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
