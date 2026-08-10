import { useState, useEffect } from 'react';
import { getProducts, searchProducts } from '../services/productService';
import { useLoading } from '../context/LoadingContext';

export const useFetchProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { showLoader, hideLoader } = useLoading();
  const [localLoading, setLocalLoading] = useState(true);

  const { keyword, category, fragrance } = filters;

  useEffect(() => {
    const fetchProds = async () => {
      showLoader();
      setLocalLoading(true);
      setError(null);
      try {
        let response;
        if (keyword || category || fragrance) {
          response = await searchProducts({
            name: keyword || undefined,
            category: category || undefined,
            fragrance: fragrance || undefined
          });
        } else {
          response = await getProducts();
        }
        setProducts(response.data || []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        hideLoader();
        setLocalLoading(false);
      }
    };

    fetchProds();
  }, [keyword, category, fragrance, showLoader, hideLoader]);

  return { products, error, loading: localLoading };
};
