import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/history/get';

const getHistoryList = () => {
  return axios.get(`${API_URL}/list`);
};

const getHistoryById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const createHistory = (data) => {
    return
};
export default {
  getHistoryList,
  getHistoryById
};