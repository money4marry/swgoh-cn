import axios from 'axios';
import { getToken } from '@/utils/auth';

// 创建axios实例
const service = axios.create({
    baseURL: 'https://api.swgoh.help', // api 的 base_url
    timeout: 0 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
    config => {
        if (getToken()) {
            config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        if (config.url === '/auth/signin') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    error => {
        // Do something with request error
        console.log(error); // for debug
        Promise.reject(error);
    }
);

// response 拦截器
service.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);
export default service;
