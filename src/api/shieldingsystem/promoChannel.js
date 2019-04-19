import request from '@/utils/request'


export function getPromoChannel() {
  return request({
    url: '/api/system/getPromoChannel',
    method: 'get',
  })
}

export function addPromoChannel(param) {
  return request({
    url: '/api/system/addPromoChannel',
    method: 'post',
    data:param,
  })
}

export function editPromoChannel(param) {
  return request({
    url: '/api/system/editPromoChannel',
    method: 'patch',
    data:param,
  })
}

export function getPromoChannelLimitMeth(param) {
  return request({
    url: '/api/system/getPromoChannel/limit',
    method: 'get',
    params:param
  })
}



