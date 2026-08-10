import api from './api';

export const getCategories = async () => {
  const response = await api.get('/api/categories');
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/api/categories/${id}`);
  return response.data;
};

export const createCategory = async (categoryFormData) => {
  const response = await api.post('/api/categories', categoryFormData, {
    headers: {
      'Content-Type': undefined,
    },
  });
  return response.data;
};

export const updateCategory = async (id, categoryFormData) => {
  const response = await api.put(`/api/categories/${id}`, categoryFormData, {
    headers: {
      'Content-Type': undefined,
    },
  });
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/api/categories/${id}`);
  return response.data;
};
