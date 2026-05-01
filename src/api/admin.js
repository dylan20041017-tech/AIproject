import service from '@/untils/request'

export function login(data){
  return service.post('/user/login',data)
}
