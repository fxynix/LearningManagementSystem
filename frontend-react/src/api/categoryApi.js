import apiClient from './apiClient';

export const getCategories = (params) => apiClient.get('/categories', { params });
export const getAllCategories = () => apiClient.get('/categories/all');
export const getCategoryById = (id) => apiClient.get(`/categories/${id}`);
export const createCategory = (data) => apiClient.post('/categories', data);
export const updateCategory = (id, data) => apiClient.patch(`/categories/${id}`, data);
export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`);