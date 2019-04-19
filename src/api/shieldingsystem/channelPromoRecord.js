import request from '@/utils/request'


export function listChannelPromoRecordMeth() {
  return request({
    url: '/api/system/listChannelPromoRecord',
    method: 'get',
  })
}


export function listChannelPromoRecordLimitMeth(param) {
  return request({
    url: '/api/system/listChannelPromoRecord/limit',
    method: 'get',
    params:param
  })
}



