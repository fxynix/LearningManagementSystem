import apiClient from './apiClient';

export const getRoles = (params) => apiClient.get('/roles', { params });
export const getAllRoles = () => apiClient.get('/roles/all'); //
export const getRoleById = (id) => apiClient.get(`/roles/${id}`);
export const getUsersByRole = (id) => apiClient.get(`/roles/${id}/users`);
export const createRole = (data) => apiClient.post('/roles', data);
export const updateRole = (id, data) => apiClient.patch(`/roles/${id}`, data);
export const deleteRole = (id) => apiClient.delete(`/roles/${id}`);