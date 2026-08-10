import api from './api';

export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

export const searchProducts = async (params = {}) => {
  const response = await api.get('/api/products/search', { params });
  return response.data;
};
