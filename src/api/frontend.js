import service from '@/untils/request'
// http://159.75.169.224:1235/api/user/add
export const register = (data) => {
  return service.post('/user/add',data)
}
// 新建会话
export const startSession = (data) => {
  return service.post('/psychological-chat/session/start',data)
}
// 获取会话列表
export const getSessionList = (params) => {
  return service.get('/psychological-chat/sessions',{params})
}

// 删除会话
export const deleteSession = (sessionId) => {
  return service.delete(`/psychological-chat/sessions/${sessionId}`)
}

// 获取会话消息
export const getSessionDetail = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
// 获取会话情绪分析
export const getSessionEmotion = (sessionId) => {
  return service.get(`/psychological-chat/session/${sessionId}/emotion`)
} 
