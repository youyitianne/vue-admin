import request from '@/utils/request'

export function getumengapp() {
  return request({
    url: '/umengapp',
    method: 'get',
  })
}

export function getumengRetention(param) {
  return request({
    url: '/umengretention',
    method: 'post',
    data:param,
  })
}

export function getumengchannels(param) {
  return request({
    url: '/umengchannels/'+param,
    method: 'get',
  })
}
