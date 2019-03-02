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
