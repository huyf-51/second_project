import axios, { AxiosInstance } from 'axios';

const http: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_SERVER_URL,
    withCredentials: true,
});

export default http;
