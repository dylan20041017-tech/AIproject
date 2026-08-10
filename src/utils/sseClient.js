/**
 * 基于 Fetch API 封装的 SSE 客户端
 * 解决原生 EventSource 不支持 POST 请求与自定义 Header 的限制
 *
 * 用法:
 *   const client = new SSEClient({
 *     url: '/api/stream',
 *     method: 'POST',
 *     headers: { Token: 'xxx' },
 *     body: JSON.stringify({ message: 'hello' }),
 *     onMessage: ({ event, data }) => console.log(event, data),
 *     onOpen: (response) => {},
 *     onError: (err) => {},
 *     onClose: () => {}
 *   })
 *   client.connect()
 *   // 中途取消: client.abort()
 */

export class SSEClient {
  constructor(options) {
    this.url = options.url
    this.method = options.method || 'POST'
    this.headers = options.headers || {}
    this.body = options.body || null
    this.signal = options.signal || null
    this.onMessage = options.onMessage || (() => {})
    this.onOpen = options.onOpen || (() => {})
    this.onError = options.onError || (() => {})
    this.onClose = options.onClose || (() => {})

    this._controller = null
    this._reader = null
    this._aborted = false
  }

  /**
   * 发起 SSE 连接
   */
  async connect() {
    this._aborted = false
    this._controller = new AbortController()

    // 合并外部 signal 与内部 AbortController
    if (this.signal) {
      this.signal.addEventListener('abort', () => this.abort())
    }

    const fetchOptions = {
      method: this.method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...this.headers,
      },
      signal: this._controller.signal,
    }

    if (this.body && this.method !== 'GET') {
      fetchOptions.body = this.body
    }

    try {
      const response = await fetch(this.url, fetchOptions)

      if (!response.ok) {
        const error = new Error(`SSE 连接失败: HTTP ${response.status}`)
        this.onError(error)
        return
      }

      this.onOpen(response)

      this._reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (!this._aborted) {
        const { done, value } = await this._reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // 解析 SSE 事件（按 \n\n 分割为一个完整事件）
        const events = buffer.split('\n\n')
        // 最后一个可能是不完整的，保留到下次
        buffer = events.pop()

        for (const chunk of events) {
          if (!chunk.trim()) continue
          const parsed = this._parseSSEChunk(chunk)
          if (parsed) {
            this.onMessage(parsed)
          }
        }
      }

      this._reader.releaseLock()
      this.onClose()
    } catch (err) {
      if (err.name === 'AbortError') return
      this.onError(err)
    }
  }

  /**
   * 解析单个 SSE 事件块
   * 格式:
   *   event: <event-type>\n
   *   data: <payload>\n
   *   data: <more-payload>\n
   */
  _parseSSEChunk(chunk) {
    const lines = chunk.split('\n')
    let event = 'message'
    const dataLines = []

    for (const line of lines) {
      if (line.startsWith(':')) {
        // SSE 注释行，忽略
        continue
      }

      const colonIdx = line.indexOf(':')
      if (colonIdx === -1) continue

      const field = line.slice(0, colonIdx)
      // 冒号后的值，去掉可能存在的首空格（SSE 标准：空格可选）
      const value = line.slice(colonIdx + 1).replace(/^ /, '')

      if (field === 'event') {
        event = value
      } else if (field === 'data') {
        dataLines.push(value)
      }
    }

    if (dataLines.length === 0) return null

    return {
      event,
      data: dataLines.join('\n'),
    }
  }

  /**
   * 中止连接
   */
  abort() {
    this._aborted = true
    if (this._reader) {
      this._reader.cancel().catch(() => {})
    }
    if (this._controller) {
      this._controller.abort()
    }
  }
}
