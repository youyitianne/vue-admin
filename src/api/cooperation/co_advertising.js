import request from '@/utils/request'

export function listAppMeth(param) {
  return request({
    url: '/cooperation/listApp',
    method: 'get',
    params:param
  })
}

export function listChannelMeth(param) {
  return request({
    url: '/cooperation/listChannel',
    method: 'get',
    params:param
  })
}


export function listAdvertisingMeth(param) {
  return request({
    url: '/cooperation/listAdvertisingInfo',
    method: 'get',
    params:param
  })
}

export function addAdvertisingMeth(param) {
  return request({
    url: '/cooperation/addAdvertisingInfo',
    method: 'post',
    data:param,
  })
}

export function delAdvertisingMeth(param) {
  return request({
    url: '/cooperation/delAdvertisingInfo',
    method: 'delete',
    data:param,
  })
}

export function updateAdvertisingMeth(param) {
  return request({
    url: '/cooperation/updateAdvertisingInfo',
    method: 'patch',
    data:param,
  })
}

