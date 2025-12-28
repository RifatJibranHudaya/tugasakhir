// src/services/api.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        // DEBUG LOG - Tambahkan ini
        console.log('🔍 Interceptor dijalankan');
        console.log('🔑 Token dari localStorage:', token);
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Header Authorization ditambahkan:', config.headers.Authorization);
        } else {
            console.log('❌ Token tidak ditemukan di localStorage!');
        }
        
        console.log('📤 Config yang akan dikirim:', config);
        return config;
    },
    (error) => {
        console.error('❌ Error di interceptor request:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('✅ Response berhasil:', response);
        return response;
    },
    (error) => {
        console.error('❌ Response error:', error.response);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;