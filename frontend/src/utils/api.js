import axios from 'axios';

const api = axios.create({

    withCredentials: true,
    
    // backend server to give api calls to, production site has localhost link, deployment env has render.com link
    baseURL: import.meta.env.VITE_API_URL
});

export default api;