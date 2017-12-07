import axios from 'axios'
import qs from 'qs'

// axios 配置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// axios.defaults.baseURL = 'https://www.zuihuibao.cn/'

// 请求拦截器
axios.interceptors.request.use(function (config) {
  console.log('请求前')
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  console.log('请求后')
  return response
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => response, error => Promise.resolve(error.response))

function checkStatus (response) {
  // console.log(response)
  if (response.status === 200 || response.status === 304) {
    return response
  }
  return {
    data: {
      code: -404,
      message: response.statusText,
      data: response.statusText
    }
  }
}

function checkCode (res) {
  // console.log(res.data.return_code)
  if (res.data.return_code !== '0') { // 返回码不为0 弹出错误信息
    alert(res.data.message)
  }
  return res
}

// 封装axios的post请求

export default {
  post (url, data) {
    return axios({
      method: 'post', // 请求协议
      url: url, // 请求的地址
      data: qs.stringify(data), // post 请求的数据
      timeout: 30000, // 超时时间, 单位毫秒
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(checkStatus).then(checkCode)
  },
  get (url, params) {
    return axios({
      method: 'get',
      url: url,
      params, // get 请求时带的参数
      timeout: 30000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(checkStatus).then(checkCode)
  }
}
