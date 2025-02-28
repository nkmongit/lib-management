// frontend/src/components/MultiSelectDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';

const MultiSelectDropdown = ({ options, selectedOptions, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((o) => o !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  // Options not yet selected
  const availableOptions = options.filter(option => !selectedOptions.includes(option));

  return (
    <div ref={containerRef} className="relative">
      <div 
        className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selectedOptions.length === 0 && <span className="text-gray-400 text-xs">Select categories...</span>}
        {selectedOptions.map((option) => (
          <div 
            key={option} 
            className="flex items-center bg-blue-50 text-blue-600 px-1.5 py-0.5 text-xs rounded-full"
            title={option}  // Tooltip on hover
          >
            <span className="mr-1 overflow-hidden whitespace-nowrap text-ellipsis" style={{ maxWidth: '4rem' }}>
              {option}
            </span>
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                onChange(selectedOptions.filter(o => o !== option));
              }}
              className="focus:outline-none text-blue-600"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      {open && availableOptions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto">
          {availableOptions.map(option => (
            <div 
              key={option} 
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
              onClick={() => toggleOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
