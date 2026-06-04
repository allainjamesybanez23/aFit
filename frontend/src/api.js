import axios from 'axios';

const api = axios.create({
    // This pulls from the .env file we created in Step 1
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
});

export default api;