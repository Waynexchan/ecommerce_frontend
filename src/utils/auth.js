import { useAuthStore } from "../store/auths";
import axios from './axios';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import swal from 'sweetalert2';

const Toast = swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
});

export const login = async (email, password) => {
    try {
        const { data, status } = await axios.post("user/token/", {
            email,
            password
        });

        if (status === 200) {
            setAuthUser(data.access, data.refresh);

            Toast.fire({
                icon: "success",
                title: "Login successfully"
            });
        }
        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error.response.data?.detail || 'Something went wrong'
        };
    }
};

export const register = async (full_name, email, phone, password, password2) => {
    try {
        const { data } = await axios.post('user/register/', {
            full_name,
            email,
            phone,
            password,
            password2
        });

        await login(email, password);

        Toast.fire({
            icon: "success",
            title: "Account created successfully"
        });

        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error.response.data?.detail || 'Something went wrong'
        };
    }
};

export const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    useAuthStore.getState().setUser(null);

    Toast.fire({
        icon: "success",
        title: "Logged out successfully"
    });
};

export const setUser = async () => {
    try {
        const accessToken = Cookies.get("access_token");
        const refreshToken = Cookies.get("refresh_token");

        if (!accessToken || !refreshToken) {
            return;
        }

        if (isAccessTokenExpired(accessToken)) {
            const response = await getRefreshToken(refreshToken);
            setAuthUser(response.access, response.refresh);
        } else {
            setAuthUser(accessToken, refreshToken);
        }
    } catch (error) {
        console.error('Error setting user:', error);
    }
};

export const setAuthUser = (access_token, refresh_token) => {
    Cookies.set('access_token', access_token, {
        expires: 1,
        secure: true,
    });

    Cookies.set('refresh_token', refresh_token, {
        expires: 7,
        secure: true,
    });

    const user = jwt_decode(access_token) ?? null;

    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async () => {
    const refresh_token = Cookies.get("refresh_token");
    const response = await axios.post("user/token/refresh/", {
        refresh: refresh_token
    });

    return response.data;
};

export const isAccessTokenExpired = (accessToken) => {
    try {
        const decodedToken = jwt_decode(accessToken);
        return decodedToken.exp < Date.now() / 1000;
    } catch (error) {
        console.log(error);
        return true;
    }
};

export const clearExpiredCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
};

const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const clearExpiredLocalStorage = () => {
    Object.keys(localStorage).forEach((key) => {
        const itemStr = localStorage.getItem(key);
        if (itemStr && isJsonString(itemStr)) {
            try {
                const item = JSON.parse(itemStr);
                const now = new Date();
                if (item.expiry && now.getTime() > item.expiry) {
                    localStorage.removeItem(key);
                }
            } catch (error) {
                console.error(`Error parsing localStorage item with key "${key}":`, error);
                localStorage.removeItem(key);
            }
        } else {
            localStorage.removeItem(key); 
        }
    });
};

const setItemWithExpiry = (key, value, ttl) => {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
};

setItemWithExpiry('token', '123456', 3600000);
