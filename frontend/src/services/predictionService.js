import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://127.0.0.1:8000/predictions/predict';
const API_URL_MUSHROOM = 'http://127.0.0.1:8000/mushrooms/get';


const postPrediction = (formData) => {
  const token = Cookies.get('access_token'); // Pobierz token z ciasteczek
  return axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}` // Dodaj nagłówek Authorization
    }
  });
};

const getMushroom = (id) => {
  return axios.get(`${API_URL_MUSHROOM}/${id}`);
};

export default {
  postPrediction,
  getMushroom
};