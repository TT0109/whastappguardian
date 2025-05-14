// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: `https://whatsapp-data1.p.rapidapi.com`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-rapidapi-host': `whatsapp-data1.p.rapidapi.com`,
    'x-rapidapi-key': `1fc33ddd2fmsh09294d4a75ba5b3p1eb72bjsn657681542060`
  },
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    return Promise.reject(error);
  }
);

export default api;
