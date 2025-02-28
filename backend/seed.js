// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  // Remove existing data
  await User.deleteMany({});
  await Book.deleteMany({});

  // Create dummy admin user
  const adminData = {
    name: 'Admin User',
    email: 'admin@example.com', // Dummy admin email
    password: 'admin123',       // Dummy password (will be hashed in the User model pre-save hook)
    role: 'admin',
  };

  const adminUser = new User(adminData);
  await adminUser.save();
  console.log('Admin user created:', adminUser.email);

  // Create example books
  const booksData = [
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      category: 'Classic',
      price: 10,
      rentalPrice: 2,
      available: true,
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      category: 'Dystopian',
      price: 12,
      rentalPrice: 3,
      available: true,
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '9780061120084',
      category: 'Classic',
      price: 15,
      rentalPrice: 4,
      available: true,
    },
  ];

  await Book.insertMany(booksData);
  console.log('Books seeded successfully');

  process.exit();
};

seedData();
