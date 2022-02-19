/*
 * @Descripttion:封装axios请求
 * @Author: you name
 * @Date: 2021-04-19 19:08:32
 */
import axios from 'axios';
import store from '@/store';
import router from '@/router/staticRouter';
import { Message } from 'element-ui';
import { baseUrl } from '@/config/env';
import { localstorageGet } from '@/utils/auth';

const getHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded'
};
const postHeaders = {
  'Content-Type': 'application/json'
};
const fileHeader = {
  'Content-Type': 'multipart/form-data'
};

const http = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
  headers: getHeaders
});
http.interceptors.request.use(config => {
  return config;
});
// response 拦截器
http.interceptors.response.use(
  res => {
    return res.data;
  },
  error => {
    console.log(error, 'errr');
    return Promise.reject(error);
  }
);

function apiAxios(method, url, params, response, file) {
  // const sid = 'ca48fb72-f44e-422d-87da-cd92f10d51d2'; // 后端联调
  const sid = localstorageGet('token') || ''; // 放开
  // console.log('sid---apiAxios:', sid);

  params.sid = sid;
  const dd = getHeaders;
  const po = postHeaders;
  const fi = file ? fileHeader : {};

  dd.sid = sid;
  po.sid = sid;
  fi.sid = sid;
  if (sid) {
    url = `${url}?sid=${sid}&platformCode=400001`;
  }
  http({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    headers: file ? fi : method === 'GET' ? dd : po
  })
    .then(function (res) {
      if (res.code && res.code === 'AUTH_401') {
        Message({
          message: '登录过期，请重新登录',
          type: 'error',
          duration: 5 * 1000
        });
        store.commit('user/RESET_STATE');
        store.commit('permission/RESET_PERMISSION');
        location.reload();
        router.push({ path: '/login' });
      } else {
        response(res);
      }
    })
    .catch(function (err) {
      response(err);
    });
}

export default {
  get: function (url, params, response) {
    return apiAxios('GET', url, params, response);
  },
  post: function (url, params, response, file) {
    return apiAxios('POST', url, params, response, file);
  },
  put: function (url, params, response) {
    return apiAxios('PUT', url, params, response);
  },
  delete: function (url, params, response) {
    return apiAxios('DELETE', url, params, response);
  }
};
