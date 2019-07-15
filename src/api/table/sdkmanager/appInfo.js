import request from '@/utils/request'

export function editAppInfo(param) {
  return request({
    url: '/tjsdk/editAppInfo',
    method: 'patch',
    data:param
  })
}

export function listAppConfigInfo(param) {
  return request({
    url: '/tjsdk/listAppConfigInfo',
    method: 'get',
    params:param,
  })
}


export function listAppInfo(param) {
  return request({
    url: '/tjsdk/listAppInfo',
    method: 'get',
    params:param,
  })
}

export function publishAppInfo(param) {
  return request({
    url: '/tjsdk/publishAppInfo',
    method: 'post',
    data:param
  })
}

