import apiClient from './apiClient';

export const getCourses = (params) => apiClient.get('/courses', { params });
export const getAllCourses = () => apiClient.get(`/courses/all`);
export const getCourseById = (id) => apiClient.get(`/courses/${id}`);
export const createCourse = (data) => apiClient.post('/courses', data);
export const updateCourse = (id, data) => apiClient.patch(`/courses/${id}`, data);
export const deleteCourse = (id) => apiClient.delete(`/courses/${id}`);