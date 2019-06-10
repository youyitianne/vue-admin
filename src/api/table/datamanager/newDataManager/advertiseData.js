import request from '@/utils/request'

export function getPlatformHandler() {
  return request({
    url: '/dataStatisics/getPlatform',
    method: 'get',
  })
}


export function getAppHandler() {
  return request({
    url: '/dataStatisics/getApp',
    method: 'get',
  })
}


export function getAdvertisementHandler(param) {
  return request({
    url: '/dataStatisics/getAdvertisement',
    method: 'get',
    params:param
  })
}
