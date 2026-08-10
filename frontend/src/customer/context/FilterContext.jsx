import React, { createContext, useContext, useState, useCallback } from 'react';

const FilterContext = createContext(null);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchFragrance, setSearchFragrance] = useState('');
  const [sortOption, setSortOption] = useState('newest'); // newest, priceAsc, priceDesc, nameAsc, nameDesc

  const clearFilters = useCallback(() => {
    setSearchKeyword('');
    setSearchCategory('');
    setSearchFragrance('');
    setSortOption('newest');
  }, []);

  return (
    <FilterContext.Provider value={{
      searchKeyword, setSearchKeyword,
      searchCategory, setSearchCategory,
      searchFragrance, setSearchFragrance,
      sortOption, setSortOption,
      clearFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};
