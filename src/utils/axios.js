import axios from 'axios';
import Cookies from 'js-cookie';
import { isAccessTokenExpired, setAuthUser, getRefreshToken } from './auth';

const apiInstance = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api/v1/',
    baseURL: 'https://sw-ecommerce-api.up.railway.app/api/v1/',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json', 
        Accept: 'application/json',
    },
    withCredentials: true,  // Ensure credentials are sent with requests
});

apiInstance.interceptors.request.use(async (config) => {
    const access_token = Cookies.get('access_token');
    const refresh_token = Cookies.get('refresh_token');

    if (access_token && refresh_token && isAccessTokenExpired(access_token)) {
        const response = await getRefreshToken(refresh_token);
        setAuthUser(response.access, response.refresh);
        config.headers.Authorization = `Bearer ${response.access}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiInstance;
