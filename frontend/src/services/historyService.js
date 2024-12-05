import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/history/get';

const getHistoryListByUserId = async (userID) => {
  return await axios.get(`${API_URL}/list/user/${userID}`);
};

const getHistoryByUserIdAndHistoryId = async (userID, historyID) => {
  return await axios.get(`${API_URL}/user/${userID}/history/${historyID}`);
};

export default {
  getHistoryListByUserId,
  getHistoryByUserIdAndHistoryId,
};