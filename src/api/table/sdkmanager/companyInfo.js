import request from '@/utils/request'

export function getcompanyInfoMeth() {
  return request({
    url: '/api/companyInfo',
    method: 'get',
  })
}

export function addcompanyInfoMeth(param) {
  return request({
    url: '/api/companyInfo',
    method: 'post',
    data:param
  })
}

export function updatecompanyInfoMeth(param) {
  return request({
    url: '/api/companyInfo',
    method: 'patch',
    data:param
  })
}
