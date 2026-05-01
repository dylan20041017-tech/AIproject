import service from '@/untils/request'

export function login(data){
  return service.post('/user/login',data)
}
export function CategoryTree(){
  return service.get('/knowledge/category/tree')
}
export function articlePage(params){
  return service.get('/knowledge/article/page',{params})
}
