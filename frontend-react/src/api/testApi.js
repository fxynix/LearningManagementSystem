import apiClient from './apiClient';

export const getTests = (params) => apiClient.get('/tests', { params });
export const getAllTests = () => apiClient.get(`/tests/all`);
export const getTestById = (id) => apiClient.get(`/tests/${id}`);
export const createTest = (data) => apiClient.post('/tests', data);
export const updateTest = (id, data) => apiClient.patch(`/tests/${id}`, data);
export const deleteTest = (id) => apiClient.delete(`/tests/${id}`);