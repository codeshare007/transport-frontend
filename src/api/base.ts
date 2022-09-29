import axios from 'axios';

const baseApiUrl = process.env.REACT_APP_API;


const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default api;