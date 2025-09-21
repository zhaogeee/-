import axios from "axios";
// import QueryString from "qs";
export const Service = axios.create({
  timeout: 60000, // 请求超时时间
  method: "post",
  baseURL:"https://4068-218-249-94-210.ngrok-free.app/api",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "ngrok-skip-browser-warning":69420
  },
});
// 添加请求拦截器
Service.interceptors.request.use((config) => {
  let token = window.sessionStorage.getItem('AccountToken');
  if(token!==""){
    console.log(token)
    config.headers.token = token;
    // console.log(encodeURIComponent(UserBasicInfo))
  }
  // console.log("config",config);
  // console.log("data",config.data);
  return config;
});
// 添加响应拦截器
Service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log("TCL: error", error);
    return Promise.reject(error);
  }
);
function request(
  url,
  params,
  options = { loading: true, mock: false, error: true },
  method
) {
  return new Promise((resolve, reject) => {
    let data = {};
    // get请求使用params字段
    // if (method == "get" || method == "delete") data = { params };
    if (method == "get") data = { params };
    // post、put、patch、delete请求使用data字段
    // if (method == "post" || method == "put"|| method == "patch") data = { data: params };
    if (method == "post" || method == "put"|| method == "patch" || method == "delete") data = { data: params };
    // 通过mock平台可对局部接口进行mock设置
    if (options.mock) url = "http://www.mock.com/mock/xxxx/api";
    Service({url,method,...data,})
    .then((res) => {
      // 此处作用很大，可以扩展很多功能。
      // 比如对接多个后台，数据结构不一致，可做接口适配器
      // 也可对返回日期/金额/数字等统一做集中处理
      if (res) {
        console.log("响应：",res)
        resolve(res);
      } else {
        reject(res);
      }
    })
    .catch((error) => {
      throw new Error(error);
    })
    .finally(() => {});
  });
}
// 封装GET请求
function getRequest(url, params, options) {
  return request(url, params, options, "get");
}
// 封装POST请求
function postRequest(url, params, options) {
  return request(url, params, options, "post");
}
// 封装DELETE请求
function deleteRequest(url, params, options) {
    return request(url, params, options, "delete");
}
// 封装PUT请求
function putRequest(url, params, options) {
    return request(url, params, options, "put");
}
// 封装PATCH请求
function patchRequest(url, params, options) {
    return request(url, params, options, "patch");
}

export {
  getRequest,
  postRequest,
  deleteRequest,
  putRequest,
  patchRequest
};