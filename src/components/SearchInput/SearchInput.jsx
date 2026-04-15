import React, { useState, useEffect } from 'react';

function SearchInput({ onSearch, placeholder = 'Search...' }) {
  const [value, setValue] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    const timer = setTimeout(() => {
      onSearch(value);
    }, 500);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [value]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      <div className="relative flex items-center">
        <span className="absolute left-4 text-lg pointer-events-none">🔍</span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3.5 px-11 text-base border-2 border-gray-200 rounded-full outline-none transition-colors focus:border-blue-600 focus:ring-0 bg-white"
        />
        {value && (
          <button 
            onClick={handleClear} 
            className="absolute right-4 bg-none border-none text-lg text-gray-500 cursor-pointer p-1 rounded-full transition-colors hover:bg-gray-100"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchInput;