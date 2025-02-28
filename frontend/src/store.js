// frontend/src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
  },
});
