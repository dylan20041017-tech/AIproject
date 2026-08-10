import axios from 'axios'
import { ElMessage } from 'element-plus'
import { requestCache } from '@/utils/requestCache'

// 创建axios实例
const service = axios.create({
  baseURL: '/api',// 基础URL
  timeout: 5000// 超时时间
})

// 创建请求拦截器
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
    const { data, config } = response

    // 处理业务状态码（兼容字符串和数字）
    if (String(data.code) === '200') {
      // GET 请求成功后写入缓存
      if (config.method === 'get') {
        const key = requestCache.generateKey(config)
        requestCache.setCache(key, data.data)
      }
      return data.data
    } else {
      if (String(data.code) === '-1') {
        // 处理登录过期错误
        if (!config.url?.includes('/login')) {
          ElMessage.error(data.msg || '登录过期，请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          // 带 redirect 回跳参数
          const currentPath = window.location.hash.replace('#', '') || '/'
          window.location.href = '/auth/login?redirect=' + encodeURIComponent(currentPath)
        } else {
          ElMessage.error(data.msg || '登录错误')
        }
      } else {
        // 其他业务错误
        ElMessage.error(data.msg || '请求失败')
      }
      return Promise.reject(data)
    }
  },
  error => {
    // 网络/HTTP 错误
    const msg = error.response?.data?.msg || error.message || '网络请求失败'
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

// GET 请求：缓存命中时直接返回，跳过网络请求
service.interceptors.request.use(
  config => {
    if (config.method !== 'get' || config._skipCache) return config

    const key = requestCache.generateKey(config)
    const cached = requestCache.getCached(key)

    if (cached) {
      // 缓存命中：注入 adapter 直接返回缓存数据
      config.adapter = () =>
        Promise.resolve({
          data: { code: '200', data: cached },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        })
    }

    return config
  },
  error => Promise.reject(error)
)

export default service
