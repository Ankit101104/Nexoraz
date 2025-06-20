import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://nexoraz.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request URL:', config.url);
    if (token) {
      console.log('Token found:', token.substring(0, 20) + '...');
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Full headers:', config.headers);
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isLoginPage = window.location.pathname === '/login';

  
    if (status === 401 && !isLoginPage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error); 
  }
);

export default instance;
