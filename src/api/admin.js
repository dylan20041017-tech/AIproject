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
export function uploadFile(file,businessinfo){
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', "ARTICLE")
  formData.append('businessId', businessinfo.businessId)
  formData.append('businessField', "cover")
  return service.post('/file/upload',formData,{headers:{'Content-Type':'multipart/form-data'}})
}
