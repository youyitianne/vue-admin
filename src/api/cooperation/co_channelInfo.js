import request from '@/utils/request'

export function listChannelMeth(param) {
  return request({
    url: '/cooperation/listChannel',
    method: 'get',
    params:param
  })
}

export function addChannelMeth(param) {
  return request({
    url: '/cooperation/addChannel',
    method: 'post',
    data:param,
  })
}

export function delChannelMeth(param) {
  return request({
    url: '/cooperation/delChannel',
    method: 'delete',
    data:param,
  })
}
