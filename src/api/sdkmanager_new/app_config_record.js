import request from '@/utils/request'

export function listAppConfigInfoRecord(param) {
  return request({
    url: '/tjsdk/listAppConfigInfoRecord',
    method: 'get',
    params:param
  })
}





