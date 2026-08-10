import { useState, useEffect } from 'react';
import { getCategories } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      setLoading(true);
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return { categories, loading, error };
};
