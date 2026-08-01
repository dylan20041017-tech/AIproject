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

    // 处理业务状态码
    if (data.code === '200') {
      // GET 请求成功后写入缓存
      if (config.method === 'get') {
        const key = requestCache.generateKey(config)
        requestCache.setCache(key, data.data)
      }
      return data.data
    } else {
      if (data.code === '-1') {
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

// GET 请求：添加缓存与去重逻辑
service.interceptors.request.use(
  config => {
    // 仅对 GET 请求做缓存处理
    if (config.method === 'get' && !config._skipCache) {
      const key = requestCache.generateKey(config)

      // 1. 检查是否有进行中的相同请求 → 去重
      const pending = requestCache.getPending(key)
      if (pending) {
        // 返回相同的 Promise，外部 adapter 会等待
        config._cachedPromise = pending
        return config
      }

      // 2. 检查是否有未过期的缓存结果
      const cached = requestCache.getCached(key)
      if (cached) {
        // 标记为缓存命中，跳过实际请求
        config._cachedResult = cached
        return config
      }
    }
    return config
  },
  error => Promise.reject(error)
)

// 自定义 adapter：处理缓存命中 / 请求去重
const originalAdapter = service.defaults.adapter

service.defaults.adapter = function (config) {
  // 缓存命中：直接返回
  if (config._cachedResult !== undefined) {
    return Promise.resolve({
      data: { code: '200', data: config._cachedResult },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    })
  }

  // 请求去重：共享同一个 Promise
  if (config._cachedPromise !== undefined) {
    return config._cachedPromise
  }

  const key = requestCache.generateKey(config)

  // 发起实际请求
  const promise = originalAdapter(config)

  // 记录进行中的 GET 请求
  if (config.method === 'get' && !config._skipCache) {
    requestCache.setPending(key, promise)

    // 请求结束后从 pendingMap 移除
    promise.finally(() => {
      requestCache.deletePending(key)
    })
  }

  return promise
}

export default service
