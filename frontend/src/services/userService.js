import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/users';

const getUserList = () => {
  return axios.get(`${API_URL}/get/list`);
};

const getUserById = (id) => {
  return axios.get(`${API_URL}/get/${id}`);
};

const updateUser = (id, userData) => {
  return axios.put(`${API_URL}/update/${id}`, userData);
};

export default {
  getUserList,
  getUserById,
  updateUser
};