import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';


const register = (userData) => {
  return axios.post(`${API_URL}/users/register`, userData);
};

const login = async (formData) => {
  const response = await axios.post(`${API_URL}/users/login`, formData);
  return response.data;
};

const refreshToken = async (token) => {
  const response = await axios.post(`${API_URL}/auth/token/refresh`, null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  register,
  login,
  refreshToken
};