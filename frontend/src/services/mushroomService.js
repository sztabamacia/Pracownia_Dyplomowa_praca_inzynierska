import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/mushrooms';

const getMushroomList = () => {
  return axios.get(`${API_URL}/get/list`);
};

const getMushroomById = (id) => {
  return axios.get(`${API_URL}/get/${id}`);
};

const createMushroom = (mushroomData) => {
  return axios.post(`${API_URL}/create`, mushroomData);
};

export default {
  getMushroomList,
  getMushroomById,
  createMushroom
};