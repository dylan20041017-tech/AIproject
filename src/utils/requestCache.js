/**
 * 请求缓存与去重工具
 *
 * 两种策略:
 * 1. 请求去重（pendingMap）: 相同请求并发时共享同一个 Promise，防止重复发送
 * 2. 结果缓存（cacheMap）: 指定 TTL 内直接返回缓存结果，不发起请求
 */

const DEFAULT_TTL = 30_000 // 默认缓存 30 秒

export class RequestCache {
  constructor(ttl = DEFAULT_TTL) {
    this.ttl = ttl
    this.pendingMap = new Map()  // key → Promise（请求去重）
    this.cacheMap = new Map()    // key → { data, timestamp }（结果缓存）
  }

  /**
   * 根据 axios config 生成缓存 key
   */
  generateKey(config) {
    const { method, url, params } = config
    const paramStr = params ? JSON.stringify(params) : '{}'
    return `${method}:${url}:${paramStr}`
  }

  /**
   * 检查是否有缓存的结果（未过期）
   */
  getCached(key) {
    const entry = this.cacheMap.get(key)
    if (!entry) return null
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cacheMap.delete(key)
      return null
    }
    return entry.data
  }

  /**
   * 写入结果缓存
   */
  setCache(key, data) {
    this.cacheMap.set(key, { data, timestamp: Date.now() })
  }

  /**
   * 检查是否有进行中的相同请求
   */
  getPending(key) {
    return this.pendingMap.get(key) || null
  }

  /**
   * 记录进行中的请求
   */
  setPending(key, promise) {
    this.pendingMap.set(key, promise)
  }

  /**
   * 移除进行中的请求记录
   */
  deletePending(key) {
    this.pendingMap.delete(key)
  }

  /**
   * 清除所有缓存
   */
  clearAll() {
    this.pendingMap.clear()
    this.cacheMap.clear()
  }

  /**
   * 清除指定 key 的缓存
   */
  clear(key) {
    this.pendingMap.delete(key)
    this.cacheMap.delete(key)
  }
}

// 单例，全局共享
export const requestCache = new RequestCache()
