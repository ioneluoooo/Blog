import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:4444'
})

// middleware that checks if we got a token or not 
// and if it is then make a request

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token');
    // for every request, we check if there is something in the localStorage and then 
    return config;
})

export default instance