import { useEffect, useState } from 'react';
import axios from 'axios';
import { isAccessTokenExpired, setAuthUser, getRefreshToken } from './auth';
import { BASE_URL } from './constants';
import Cookies from 'js-cookie';

const useAxios = () => {
    const [axiosInstance, setAxiosInstance] = useState(null);

    useEffect(() => {
        const access_token = Cookies.get('access_token');
        const refresh_token = Cookies.get('refresh_token');

        const instance = axios.create({
            baseURL: BASE_URL,
            headers: { Authorization: `Bearer ${access_token}` },
            withCredentials: true, // Ensure credentials are sent with requests
        });

        instance.interceptors.request.use(async (req) => {
            if (access_token && refresh_token && isAccessTokenExpired(access_token)) {
                const response = await getRefreshToken(refresh_token);
                setAuthUser(response.access, response.refresh);

                req.headers.Authorization = `Bearer ${response.access}`;
            }
            return req;
        });

        setAxiosInstance(instance);
    }, []);

    return axiosInstance;
};

export default useAxios;
