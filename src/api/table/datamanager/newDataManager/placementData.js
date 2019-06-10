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

export function addPlacementHandler(param) {
  return request({
    url: '/dataStatisics/addPlacement',
    method: 'post',
    data:param,
  })
}


export function delPlacementHandler(param) {
  return request({
    url: '/dataStatisics/delPlacement',
    method: 'delete',
    params:param
  })
}

export function editPlacementHandler(param) {
  return request({
    url: '/dataStatisics/editPlacement',
    method: 'patch',
    data:param,
  })
}

export function getPlacementHandler(param) {
  return request({
    url: '/dataStatisics/getPlacement',
    method: 'get',
    params:param
  })
}

