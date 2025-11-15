// lib/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`Response received:`, response.status);
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to server. Please make sure the backend is running.');
    } else if (error.response?.status === 404) {
      throw new Error('Server endpoint not found. Please check the API URL.');
    } else {
      throw new Error(error.response?.data?.error || 'API request failed');
    }
  }
);

export const propertiesAPI = {
  getAll: (filters = {}) => api.get('/properties', { params: filters }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (propertyData) => api.post('/properties', propertyData),
  update: (id, propertyData) => api.put(`/properties/${id}`, propertyData),
  delete: (id) => api.delete(`/properties/${id}`),
  search: (filters) => api.get('/properties/search', { params: filters }),
};

export const favoritesAPI = {
  checkFavorite: (userSessionId, propertyId) => 
    api.get(`/favorites/check/${propertyId}`, { 
      params: { user_session_id: userSessionId } 
    }),
  
  addFavorite: (userSessionId, propertyId) => 
    api.post('/favorites', { 
      property_id: propertyId, 
      user_session_id: userSessionId 
    }),
  
  removeFavorite: (userSessionId, propertyId) => 
    api.delete(`/favorites/${propertyId}`, { 
      data: { user_session_id: userSessionId } 
    }),
  
  getAll: () => api.get('/favorites'),
};

export const contactAPI = {
  submitInquiry: (inquiryData) => api.post('/contact', inquiryData),
  sendMessage: (data) => api.post('/contact', data),
};

export default api;