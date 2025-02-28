// frontend/src/components/CategoryFolders.jsx
import React from 'react';

const CategoryFolders = ({ categories, selectedCategory, onSelectCategory }) => {
  const allCategories = ['All', ...categories];
  return (
    <div className="flex flex-wrap gap-4">
      {allCategories.map((cat) => (
        <div
          key={cat}
          className={`w-24 h-24 p-2 border rounded-lg cursor-pointer flex flex-col items-center justify-center hover:bg-blue-100 transition 
            ${selectedCategory === cat || (cat === 'All' && !selectedCategory)
              ? 'bg-blue-200 border-blue-500'
              : 'bg-white'}`}
          onClick={() => onSelectCategory(cat === 'All' ? null : cat)}
        >
          <div className="text-3xl mb-1">📁</div>
          <span className="block w-full text-center text-xs font-semibold overflow-hidden break-words line-clamp-2" title={cat}>
            {cat}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategoryFolders;
