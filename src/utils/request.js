import axios from 'axios';
import { Message } from 'element-ui';
import { getToken } from '@/utils/auth';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: 5000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers.Authorization = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 兼容blob下载出错json提示
    if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
      const reader = new FileReader();
      reader.readAsText(error.response.data, 'utf-8');
      reader.onload = function (e) {
        const errorMsg = JSON.parse(reader.result).message;
        Message({
          message: errorMsg,
          type: 'error',
          duration: 5 * 1000
        });
      };
    } else {
      let code = 0;
      try {
        code = error.response.data.status;
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          Message({
            message: '网络请求超时',
            type: 'error',
            duration: 5 * 1000
          });
          return Promise.reject(error);
        }
      }
      if (code) {
        const errorMsg = error.response.data.message;
        if (errorMsg !== undefined) {
          Message({
            message: errorMsg,
            type: 'error',
            duration: 5 * 1000
          });
        }
      } else {
        Message({
          message: '接口请求失败',
          type: 'error',
          duration: 5 * 1000
        });
      }
    }
    return Promise.reject(error);
  }
);
export default service;
