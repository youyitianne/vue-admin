import request from '@/utils/request'


export function getUmengAppHandler() {
  return request({
    url: '/dataStatisics/getUmengApp',
    method: 'get'
  })
}

export function getUmengChannelHandler(param) {
  return request({
    url: '/dataStatisics/getUmengChannel',
    method: 'get',
    params:param
  })
}

export function getUmengVersionHandler(param) {
  return request({
    url: '/dataStatisics/getUmengVersion',
    method: 'get',
    params:param
  })
}

export function getUmengDataHandler(param) {
  return request({
    url: '/dataStatisics/getUmengData',
    method: 'post',
    data:param,
  })
}
