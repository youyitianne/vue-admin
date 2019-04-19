import request from '@/utils/request'


export function getip(param) {
  return request({
    url: '/api/system/getip',
    method: 'post',
    data:param,
  })
}

export function postip(param) {
  return request({
    url: '/api/system/postip',
    method: 'post',
    data:param,
  })
}

export function getapplist(param) {
  return request({
    url: '/api/system/getapplist',
    method: 'post',
    data:param,
  })
}

export function applist() {
  return request({
    url: '/api/system/applist',
    method: 'post',
  })
}

export function searchapp(param) {
  return request({
    url: '/api/system/searchapp',
    method: 'post',
    data:param,
  })
}

export function getparams(param) {
  return request({
    url: '/api/system/getparams',
    method: 'post',
    data:param,
  })
}

export function addparams(param) {
  return request({
    url: '/api/system/addparams',
    method: 'post',
    data:param,
  })
}

export function editparams(param) {
  return request({
    url: '/api/system/editparams',
    method: 'post',
    data:param,
  })
}
