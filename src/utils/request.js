import axios from 'axios'
import {
  Message,
  MessageBox,
  Loading
} from 'element-ui'

let loadingInstance = null
const service = axios.create({
  baseURL: '/eidm', // api的base_url
  timeout: 600 * 1000
})

// request interceptor
service.interceptors.request.use(config => {
  config.headers['content-type'] = config.headers['content-type'] ? config.headers['content-type'] : 'application/json'
  config.headers.dataType = 'json'
  loadingInstance = Loading.service({'fullscreen': true, background: 'rgba(255, 255, 255, 0.1)'})
  if (sessionStorage.getItem('token')) {
    //  存在将api_token写入 request header
    const Authorization = 'Bearer ' + sessionStorage.getItem('token')
    config.headers.Authorization = Authorization
  }
  if (config.method === 'get') {
    config.params = {
      t: Date.parse(new Date()),
      ...config.params
    }
  }
  return config
}, error => {
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    // 响应成功关闭loading
    loadingInstance.close()
    const res = response.data
    if (typeof res == 'object') {
      if (res.code === '1') {
        return res
      } else {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000,
          offset: 90
        })
        return Promise.reject()
      }
    }
    return response
  },
  error => {
    // 响应成功关闭loading
    loadingInstance.close()
    if (!error.response) {
      Message({
        message: '网络异常，请稍后重试',
        type: 'error',
        duration: 5 * 1000,
        offset: 90
      })
      return Promise.reject()
    }
    switch (error.response.status) {
      case 401:
        MessageBox.alert('认证失效，请重新认证', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            sessionStorage.removeItem('token')
            window.close()
          }
        })
        break
      default:
        Message({
          message: '未知异常，请稍后重试',
          type: 'error',
          duration: 5 * 1000,
          offset: 90
        })
    }
    return Promise.reject(error)
  })

export default service
