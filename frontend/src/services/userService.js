import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://127.0.0.1:8000/users';

// Konfiguracja Axios, aby automatycznie dodawać nagłówek Authorization do wszystkich żądań
axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getUserList = () => {
  return axios.get(`${API_URL}/get/list`);
};

const getUserById = (id) => {
  return axios.get(`${API_URL}/get/${id}`);
};

const updateUser = (id, userData) => {
  return axios.put(`${API_URL}/update/${id}`, userData);
};

const userService = {
  getUserList,
  getUserById,
  updateUser
};

export default userService;