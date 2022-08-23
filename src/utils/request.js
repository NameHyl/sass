import axios from 'axios';
const request = axios.create({
  // baseURL: 'http://10.218.60.211:9102', //门店模块
  // baseURL: 'http://10.218.60.211:9101', //菜品模块

  timeout: 5000,
  headers: { tenantId: 500, userId: 11000 },
});
request.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
//相应拦截器
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    return Promise.reject(err);
  }
);
export default request;
