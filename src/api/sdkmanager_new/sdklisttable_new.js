import request from '@/utils/request'

export function addSDKTypeMeth(param) {
  return request({
    url: '/tjsdk/addSDKType',
    method: 'post',
    data:param
  })
}

export function getSDKTypeMeth(param) {
  return request({
    url: '/tjsdk/getSDKType',
    method: 'get',
    params:param
  })
}

export function getSDKParamTypeMeth(param) {
  return request({
    url: '/tjsdk/getSDKParamType',
    method: 'get',
    params:param
  })
}

export function editSDKTypeMeth(param) {
  return request({
    url: '/tjsdk/editSDKType',
    method: 'patch',
    data:param
  })
}

export function delSDKTypeMeth(param) {
  return request({
    url: '/tjsdk/delSDKType',
    method: 'delete',
    data:param
  })
}

export function delSDKParamTypeMeth(param) {
  return request({
    url: '/tjsdk/delSDKParamType',
    method: 'delete',
    data:param
  })
}

