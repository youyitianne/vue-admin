import request from '@/utils/request'

export function createSdk(param) {
  return request({
    url: '/api/sdk',
    method: 'post',
    data:param
  })
}

export function getSdk() {
  return request({
    url: '/api/sdk',
    method: 'get',
  })
}

export function updateSdk(param) {
  return request({
    url: '/api/sdk/'+param.id,
    method: 'patch',
    data:param
  })
}

export function getSdkLimitMeth(param) {
  return request({
    url: '/api/sdk/limit',
    method: 'get',
    params:param
  })
}

