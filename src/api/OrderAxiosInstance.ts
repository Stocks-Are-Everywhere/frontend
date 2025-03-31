import axios from 'axios';

const orderAxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_ORDER_API_URL}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default orderAxiosInstance;
