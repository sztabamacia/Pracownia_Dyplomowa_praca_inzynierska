import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://127.0.0.1:8000/history';

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

const getHistoryListByUserId = async (userID) => {
  return await axios.get(`${API_URL}/get/list/user/${userID}`);
};

const getHistoryByUserIdAndHistoryId = async (userID, historyID) => {
  return await axios.get(`${API_URL}/get/user/${userID}/history/${historyID}`);
};

export default {
  getHistoryListByUserId,
  getHistoryByUserIdAndHistoryId,
};