import api from './api';

export const getProducts = async (params = {}) => {
  const response = await api.get('/api/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (productFormData) => {
  const response = await api.post('/api/products', productFormData, {
    headers: {
      'Content-Type': undefined,
    },
  });
  return response.data;
};

export const updateProduct = async (id, productFormData) => {
  const response = await api.put(`/api/products/${id}`, productFormData, {
    headers: {
      'Content-Type': undefined,
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};

export const searchProducts = async (params = {}) => {
  const response = await api.get('/api/products/search', { params });
  return response.data;
};
