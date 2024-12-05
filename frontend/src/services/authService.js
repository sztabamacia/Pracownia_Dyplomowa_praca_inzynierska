import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/users';

const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

const login = async (formData) => {
  const response = await axios.post(`${API_URL}/login`, formData);
  return response.data;
};

export default {
  register,
  login
};