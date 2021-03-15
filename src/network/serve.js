import axios from 'axios'
axios.defaults.headers.common["token"] = ""
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// axios.defaults.baseURL = 'https://service.xxx.comapi'


// 创建时自定义默认配置，超时设置为全局默认值0秒
let server = axios.create({
    baseURL: '/api',
});
  // 修改配置后，超时设置为4秒
  server.defaults.timeout =15000;



// 添加请求拦截器
server.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
server.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data;
  }, function (error) {
    // 对响应错误做点什么
    // return Promise.reject(error);
    return Promise.resolve({code: 0,data: []})
  });
  export default server
