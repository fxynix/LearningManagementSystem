import apiClient from './apiClient';

export const getTestAttempts = (params) => apiClient.get('/test-attempts', { params });
export const getTestAttemptById = (id) => apiClient.get(`/test-attempts/${id}`);
export const createTestAttempt = (data) => apiClient.post('/test-attempts', data);
export const updateTestAttempt = (id, data) => apiClient.patch(`/test-attempts/${id}`, data);
export const deleteTestAttempt = (id) => apiClient.delete(`/test-attempts/${id}`);