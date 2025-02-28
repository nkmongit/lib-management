import React from 'react';

const MultiCategorySelect = ({ categories, selectedCategories, onChange }) => {
  const handleCheckboxChange = (category) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((c) => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <label key={cat} className="flex items-center space-x-1">
          <input
            type="checkbox"
            value={cat}
            checked={selectedCategories.includes(cat)}
            onChange={() => handleCheckboxChange(cat)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">{cat}</span>
        </label>
      ))}
    </div>
  );
};

export default MultiCategorySelect;
