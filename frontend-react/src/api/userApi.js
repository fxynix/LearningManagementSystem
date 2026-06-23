import apiClient from './apiClient';

export const getUsers = (params) => apiClient.get('/users', { params });
export const getAllUsers = () => apiClient.get('/users/all');
export const getUserById = (id) => apiClient.get(`/users/${id}`);
export const createUser = (data) => apiClient.post('/users', data);
export const updateUser = (id, data) => apiClient.patch(`/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);