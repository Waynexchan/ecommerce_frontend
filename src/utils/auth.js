import { useAuthStore  }  from "../store/auths"; //import axios library

import axios from './axios'
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'


export const login = async (email, password) =>{
    try{
        const {data, status} = await axios.post("user/token/", {
            email,
            password
        }) //post to the endpoint

        if (status === 200){
            setAuthUser(data.access, data.refresh)

            //Alert -Sign In Successfully
        }
        return {data, error: null }
    }catch (error) {
        return {
            data: null,
            error: error.response.data?.detail || 'Something went wrong'
        };
    }
}

export const register = async (full_name, email, phone, password, password2) =>{
    try {
        const { data } = await axios.post('user/register/', {
            full_name, 
            email, 
            phone, 
            password, 
            password2
        })

        await login(email, password)

        //Alert -Signed up Successfully

        return {data, error: null}
    } catch (error) {
        return {
            data: null,
            error: error.response.data?.detail || 'Something went wrong'
        };
    }
}

export const logout = () =>{
    Cookies.remove("access_token")
    Cookies.remove("refresh_token")
    useAuthStore.getState().setUser(null)

    // Alert - Signed Out Successfully
}

export const setUser = async () => {
    const accessToken = Cookies.get("access_token")
    const refreshToken = Cookies.get("refresh_token")

    if (!accessToken || !refreshToken){
        return;
    }

    if (isAccessTokenExpired(accessToken)){
        const response = await getRefreshToken(refreshToken)
        setAuthUser(response.access, response.refresh)
    } else{
        setAuthUser(accessToken, refreshToken)
    }
}

export const setAuthUser = (access_token, refresh_token) => {
    // Setting access and refresh tokens in cookies with expiration dates
    Cookies.set('access_token', access_token, {
        expires: 1,  // Access token expires in 1 day
        secure: true,
    });

    Cookies.set('refresh_token', refresh_token, {
        expires: 7,  // Refresh token expires in 7 days
        secure: true,
    });

    // Decoding access token to get user information
    const user = jwt_decode(access_token) ?? null;

    // If user information is present, update user state; otherwise, set loading state to false
    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async () =>{
    const refresh_token = Cookies.get("refresh_token")
    const response = await axios.post("user/token/refresh/", {
        refresh: refresh_token
    })

    return response.data
}

export const isAccessTokenExpired = (accessToken) =>{
    try {
        const decodedToken = jwt_decode(accessToken)
        return decodedToken.exp < Date.now() /100
    } catch (error) {
        console.log(error);
        return true
    }
}