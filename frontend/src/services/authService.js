import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/users';

const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

const login = (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};

export default {
  register,
  login
};