import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwt');

const host = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export default host;
