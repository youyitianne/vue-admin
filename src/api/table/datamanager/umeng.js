import request from '@/utils/request'


export function getumeng(param) {
  return request({
    url: '/umeng',
    method: 'post',
    data:param,
  })
}

export function getumengapp() {
  return request({
    url: '/umengapp',
    method: 'get',
  })
}

export function getgdt(param) {
  return request({
    url: '/cooperation/testgdt',
    method: 'post',
    data:param,
  })
}
