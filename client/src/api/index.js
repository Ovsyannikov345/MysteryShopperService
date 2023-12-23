import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const host = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export default host;
