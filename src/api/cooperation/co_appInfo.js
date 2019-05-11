import request from '@/utils/request'

export function listAppMeth(param) {
  return request({
    url: '/cooperation/listApp',
    method: 'get',
    params:param
  })
}

export function addAppMeth(param) {
  return request({
    url: '/cooperation/addApp',
    method: 'post',
    data:param,
  })
}

export function delAppMeth(param) {
  return request({
    url: '/cooperation/delApp',
    method: 'delete',
    data:param,
  })
}
