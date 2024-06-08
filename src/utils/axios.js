import axios from 'axios'

const apiInstance = axios.create({
    baseURL : 'http://127.0.0.1:8000/api/v1/',
    timeout: 10000,

    headers: {
        'Content-Type': 'application/json', // The request will be sending data in JSON format.
        Accept: 'application/json', // The request expects a response in JSON format.
    },
})

export default apiInstance