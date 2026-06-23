import apiClient from './apiClient';

export const getLectures = (params) => apiClient.get('/lectures', { params });
export const getLectureById = (id) => apiClient.get(`/lectures/${id}`);
export const createLecture = (data) => apiClient.post('/lectures', data);
export const updateLecture = (id, data) => apiClient.patch(`/lectures/${id}`, data);
export const deleteLecture = (id) => apiClient.delete(`/lectures/${id}`);