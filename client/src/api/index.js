import axios from "axios";

const host = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        Authorization: localStorage.getItem("jwt"),
    },
});

const nearestAddress = axios.create({
    baseURL: "",
    withCredentials: false,
});

export { host, nearestAddress };
