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
  return service.get('/psychological-chat/sessions',params)
}


