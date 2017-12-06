import axios from 'axios'
import qs from 'qs'

// import { PopAlert } from 'common/js/mylayer'

axios.defaults.timeout = 65000

axios.interceptors.request.use(config => {
  // loading
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

export function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  // console.log(response)
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response.data
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常,请稍后重试！'
  }
}

export function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    alert(res.msg)
  }

  if (res && res.return_code !== '0') {
    if (res.return_code === '-1000') {
      window.location.href = '#/login'
    } else {
      // if(res.return_message){
      //   PopAlert(res.return_message)
      // }
    }
  }

  return res
}

export function MyPost (url, data) {
  return axios({
    method: 'post',
    // baseURL: 'https://cnodejs.org/api/v1',
    url,
    data: qs.stringify(data),
    timeout: 65000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }).then(
    (response) => {
      return checkStatus(response)
    }
  ).then(
    (res) => {
      return checkCode(res)
    }
  )
}

export function MyGet (url, params) {
  return axios({
    method: 'get',
    url,
    params, // get 请求时带的参数
    timeout: 60000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then(
    (response) => {
      return checkStatus(response)
    }
  ).then(
    (res) => {
      return checkCode(res)
    }
  )
}

export function checkLogin () {
  MyPost('/php2/life_ins_manage/common.php', {
    action: 'checkLogin',
    rd: Math.random()
  }).then((res) => {
    // console.log(res)
  })
}
