import service from '@/untils/request'
// http://159.75.169.224:1235/api/user/add
export const register = (data) => {
  return service.post('/user/add',data)
}