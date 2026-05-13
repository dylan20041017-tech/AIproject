import axios from 'axios'
import { ElMessage } from 'element-plus'


// 创建axios实例
const service = axios.create({
  baseURL: '/api',// 基础URL
  timeout: 5000// 超时时间
})

//创建请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 创建响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const { data, config } = response
    // 处理业务状态码
    if (data.code === '200') {
      return data.data
    } else {
      if (data.code === '-1') {
        // 处理登录过期错误
        if (!config.url?.includes('/login')) {
          ElMessage.error(data.msg || '登录过期，请重新登录')
          localStorage.removeItem('token')// 清除token
          // 清除用户信息
          localStorage.removeItem('userInfo')
          window.location.href = '/auth/login'
        } else {
          ElMessage.error(data.msg || '登录过期，请重新登录')
          return Promise.reject('网络请求失败.....')
        }
      }
    }
    return response
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
export default service